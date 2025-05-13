import { FastifyRequest, FastifyReply } from 'fastify'
import { transactionService } from '../services/transaction.service'
import { TxTransferRequest, Request, TxTradeRequest } from '../types/transaction'

export class TransactionController {
  async transfer(
    request: FastifyRequest<{ Body: Request<TxTransferRequest> }>,
    reply: FastifyReply
  ) {
    try {
      return await transactionService.transfer(request.body)
    } catch (error) {
      console.log('transfer error', error)
      reply.status(500).send({
        code: -1,
        msg: error instanceof Error ? error.message : 'Unknown error',
        data: undefined
      })
    }
  }


  async trade(
    request: FastifyRequest<{ Body: Request<TxTradeRequest> }>,
    reply: FastifyReply
  ) {
    try {
      await transactionService.trade(request.body)
    } catch (error) {
      console.log('trade error', error)
      reply.status(500).send({
        code: -1,
        msg: error instanceof Error ? error.message : 'Unknown error',
        data: undefined
      })
    }
  }
}

export const transactionController = new TransactionController() 