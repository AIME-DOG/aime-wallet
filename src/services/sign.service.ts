import { SolanaSignTransactionInputType, EthereumSignTransactionInputType } from '@privy-io/server-auth'
import { privyClient } from '../config/privy'
import { Transaction, VersionedTransaction } from '@solana/web3.js'
import base58 from 'bs58'

export interface SignRequest {
  chainType: string
  chainId: string
  from: string
  to: string
  value: string
}

export interface SignResponse {
  signedTx: string
  txHash: string
}

export class SignService {
  async signTransaction(chainType: 'SVM', params: SolanaSignTransactionInputType | EthereumSignTransactionInputType): Promise<SignResponse> {
    console.log('signTransaction', chainType, params)
    try {
      if (chainType === 'SVM') {
        const { signedTransaction } = await privyClient.walletApi.solana.signTransaction(params as SolanaSignTransactionInputType)
        console.log('signedTransaction', signedTransaction)
        // Check if signedTransaction is a VersionedTransaction by checking if it has version property
        const isVersionedTx = 'version' in signedTransaction

        let serializedTx: string
        let txHash: string

        if (isVersionedTx) {
          // Handle VersionedTransaction
          serializedTx = base58.encode((signedTransaction as VersionedTransaction).serialize())
          txHash = base58.encode((signedTransaction as VersionedTransaction).signatures[0])
        } else {
          // Handle legacy Transaction
          serializedTx = base58.encode((signedTransaction as Transaction).serialize())
          txHash = base58.encode((signedTransaction as Transaction).signature!)
        }

        return {
          signedTx: serializedTx,
          txHash
        }
      }

      throw new Error(`Unsupported chain type: ${chainType}`)
    } catch (error) {
      console.error('signTransaction error', error)
      throw error
    }

  }
}

export const signService = new SignService() 