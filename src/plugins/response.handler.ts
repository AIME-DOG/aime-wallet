import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { StandardResponse, errorResponse } from '../utils/response.handler'
import { logger } from '../utils/logger'

const responseHandler: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onSend', async (_request, _reply, payload) => {
    if (!payload) {
      return payload
    }

    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
    if (
      parsed &&
      'code' in parsed &&
      'msg' in parsed &&
      'data' in parsed
    ) {
      return payload
    }

    const response: StandardResponse = {
      code: 0,
      msg: 'success',
      data: parsed
    }

    return JSON.stringify(response)
  })

  fastify.setErrorHandler((error, _request, _reply) => {
    logger.error(JSON.stringify({
      message: error.message,
      url: _request.url,
      method: _request.method,
      headers: _request.headers,
      body: _request.body,
      query: _request.query,
      params: _request.params
    }));
    const response = errorResponse(error.message)
    _reply.status(error.statusCode || 200).send(response)
  })
}

export default fp(responseHandler) 