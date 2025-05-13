import fastify from 'fastify'
import cors from '@fastify/cors'
import { transactionRoutes } from './routes/transaction.routes'
import responseHandler from './plugins/response.handler'
import * as dotenv from 'dotenv'
import { logger } from './utils/logger'
dotenv.config()

const server = fastify({
  logger: true
})

logger.setLogger(server.log)

server.register(cors, {
  origin: true
})

server.register(responseHandler)

server.register(transactionRoutes)


server.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await server.listen({
      port: parseInt(process.env.PORT || '3001'),
      host: '0.0.0.0'
    })
    console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start() 