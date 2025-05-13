import { FastifyLoggerInstance } from 'fastify'

class Logger {
    private static instance: Logger
    private logger: FastifyLoggerInstance | null = null

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    setLogger(logger: FastifyLoggerInstance) {
        this.logger = logger
    }

    info(msg: string, ...args: any[]) {
        if (this.logger) {
            this.logger.info({ ...args }, msg)
        } else {
            console.log(msg, ...args)
        }
    }

    error(msg: string, ...args: any[]) {
        if (this.logger) {
            this.logger.error({ ...args }, msg)
        } else {
            console.error(msg, ...args)
        }
    }

    warn(msg: string, ...args: any[]) {
        if (this.logger) {
            this.logger.warn({ ...args }, msg)
        } else {
            console.warn(msg, ...args)
        }
    }

    debug(msg: string, ...args: any[]) {
        if (this.logger) {
            this.logger.debug({ ...args }, msg)
        } else {
            console.debug(msg, ...args)
        }
    }
}

export const logger = Logger.getInstance() 