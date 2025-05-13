import { FastifyInstance } from 'fastify'
import { transactionController } from '../controllers/transaction.controller'

export async function transactionRoutes(fastify: FastifyInstance) {
  fastify.post('/v1/tx/transfer', transactionController.transfer)
  fastify.post('/v1/tx/trade', transactionController.trade)
}