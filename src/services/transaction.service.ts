import { TxTransferRequest, Request, TxTradeRequest } from '../types/transaction'
import { signService } from './sign.service'
import { broadcastService } from './broadcast.service'
import { createTxService } from './create.tx.service'
export class TransactionService {

  async transfer(request: Request<TxTransferRequest>): Promise<any> {
    const { chainType, chainId, serialNo, data: { bizId } } = request
    try {
      const tx = await createTxService.createTransferTx(chainType, chainId, request.data, `${serialNo}-${bizId}`)
      const signResult = await signService.signTransaction(chainType, tx)

      const finalTxHash = await broadcastService.broadcastTransaction(chainType, +chainId, signResult.signedTx)
      if (finalTxHash !== signResult.txHash) {
        console.error('tx hash mismatch', finalTxHash, signResult.txHash)
        return
      }

      return {
        signedTx: signResult.signedTx,
        txHash: signResult.txHash,
        bizId: bizId
      }
    } catch (error) {
      console.error('transfer error', error)
      throw error
    }
  }

  async trade(request: Request<TxTradeRequest>): Promise<any> {
    const { chainType, chainId, serialNo, data: { bizId } } = request

    try {

      const data = request.data
      const tx = await createTxService.createTradeTx(chainType, chainId, serialNo, data, `${serialNo}-${bizId}`)
      const signResult = await signService.signTransaction(chainType, tx)

      let finalTxHash = ''
      const isJito = chainType === 'SVM' && (data.mev || (data.priFee && parseFloat(data.priFee) > 0))
      if (isJito) {
        finalTxHash = await broadcastService.jitoBroadcastTransaction(signResult.signedTx)
      } else {
        finalTxHash = await broadcastService.broadcastTransaction(chainType, +chainId, signResult.signedTx)
      }
      console.log('finalTxHash', finalTxHash)
      if (finalTxHash !== signResult.txHash) {
        console.error('tx hash mismatch', finalTxHash, signResult.txHash)
        throw new Error('tx hash mismatch')
      }

      return {
        signedTx: signResult.signedTx,
        txHash: signResult.txHash,
        bizId: bizId
      }
    } catch (error) {
      console.error('handleTxTradeRequest error', error)
      throw error
    }
  }
}

export const transactionService = new TransactionService()


