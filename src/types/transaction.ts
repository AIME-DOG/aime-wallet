export type TradeTxType = 'default'
export type TransferTxType = 'default'
export type TxType = TradeTxType | TransferTxType
export type GasLevel = 'slow' | 'average' | 'fast'

export interface Request<T = any> {
  trace: string
  serialNo: string
  chainType: "SVM"
  chainId: string
  type: TxType
  data: T
}
export interface Response<T = any> {
  code: number
  msg: string
  data: T
}



export interface TxTransferRequest {
  bizId: string
  tokenAddress: string
  tokenAmount: string
  userWalletAddress: string
  receiverWalletAddress: string
  gasLevel: string
}


export interface TxTradeRequest {
  bizId: string
  fromTokenAddress: string
  toTokenAddress: string
  userWalletAddress: string
  amount: string
  slippage: string
  platformFeeRate: string
  platformFeeAddress: string
  gasLevel?: GasLevel
  mev?: boolean
  priFee?: string
}
