import { FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/logger'
import crypto from 'crypto'

interface AuthResult {
    isValid: boolean
    error?: {
        code: number
        msg: string
    }
}

function flattenObject(obj: any, prefix = ''): string[] {
    return Object.entries(obj).reduce((acc: string[], [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return [...acc, ...flattenObject(value, newKey)]
        }

        return [...acc, `${newKey}=${value}`]
    }, [])
}

export function verifyAuth(
    signature: string,
    timestamp: string,
    requestBody: any,
    publicKey: string,
    currentTime: number = Date.now()
): AuthResult {
    try {
        if (!publicKey || !timestamp || !signature) {
            return {
                isValid: false,
                error: {
                    code: -1,
                    msg: 'Missing header'
                }
            }
        }

        const requestTime = parseInt(timestamp)
        if (Math.abs(currentTime - requestTime) > 5 * 60 * 1000) {
            return {
                isValid: false,
                error: {
                    code: -1,
                    msg: 'Request timestamp expired'
                }
            }
        }

        const requestData = {
            timestamp,
            ...(requestBody ? flattenObject(requestBody) : {})
        }

        const verifyData = Object.entries(requestData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.join('&')
                }
                return `${key}=${value}`
            })
            .join('&')

        const verify = crypto.createVerify('SHA256')
        verify.update(verifyData)
        const isValid = verify.verify(
            `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
            Buffer.from(signature, 'base64')
        )

        if (!isValid) {
            return {
                isValid: false,
                error: {
                    code: -1,
                    msg: 'Invalid signature'
                }
            }
        }

        return { isValid: true }
    } catch (error) {
        logger.error('Auth verification error:', error)
        return {
            isValid: false,
            error: {
                code: -1,
                msg: 'Authentication failed'
            }
        }
    }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const timestamp = request.headers['timestamp'] as string
    const signature = request.headers['signature'] as string
    const publicKey = process.env.SERVER_PUBLIC_KEY!
    const result = verifyAuth(signature, timestamp, request.body, publicKey)

    if (!result.isValid && result.error) {
        logger.warn(`Auth failed: ${result.error.msg}`)
        return reply.status(401).send({
            code: result.error.code,
            msg: result.error.msg,
            data: null
        })
    }
} 