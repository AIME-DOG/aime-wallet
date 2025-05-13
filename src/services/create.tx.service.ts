import { PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction, ComputeBudgetProgram } from '@solana/web3.js'
import { jupClient } from '../config/jup'
import { TxTradeRequest, TxTransferRequest } from '../types/transaction'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction
} from '@solana/spl-token'
import BN from 'bn.js'
import { SolanaSignTransactionInputType, EthereumSignTransactionInputType } from '@privy-io/server-auth'
import { logger } from '../utils/logger'
import axios from 'axios'
import { SwapRequest } from '@jup-ag/api'
import { connection } from '../config/sol.rpc'

function createSolanaSignTransactionInputType(tx: VersionedTransaction, address: string, idempotencyKey: string): SolanaSignTransactionInputType {
  return {
    transaction: tx,
    // caip2: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    address: address,
    chainType: 'solana',
    idempotencyKey: idempotencyKey
  }
}

async function getJitoPriorityFee(priFee: string): Promise<number> {
  try {
    const response = await axios.get('https://bundles.jito.wtf/api/v1/bundles/tip_floor');
    if (response.data && response.data.length > 0) {
      // Use the 75th percentile as a reasonable default
      const jitoPriorityFee = response.data[0].landed_tips_75th_percentile;

      let _priFee = parseFloat(priFee || '0.000001')
      if (_priFee < 0.000001) {
        _priFee = 0.000001
      }
      const userPriorityFeeInLamports = Math.floor(_priFee * 1e9);
      // Convert Jito priority fee to lamports (it's already in SOL)
      const jitoPriorityFeeInLamports = Math.floor(jitoPriorityFee * 1e9);
      return Math.min(userPriorityFeeInLamports, jitoPriorityFeeInLamports);
    }
    return 0;
  } catch (error) {
    logger.error('Failed to fetch Jito priority fee:', error);
    return 0;
  }
}

async function createJUPSwapTx(_chainType: 'SVM', _chainId: string, _serialNo: string, params: TxTradeRequest, idempotencyKey: string): Promise<SolanaSignTransactionInputType | EthereumSignTransactionInputType> {
  const quoteParams = {
    inputMint: params.fromTokenAddress,
    outputMint: params.toTokenAddress,
    amount: +params.amount,
    // dexes: ['Pump.fun', 'Pump.fun Amm', 'Raydium', 'Raydium CP', 'Raydium CLMM', 'Moonshot'],
    slippageBps: Math.floor(+params.slippage * 10000),
    // swapMode: SwapMode.ExactIn,
    // restrictIntermediateTokens: false,
    onlyDirectRoutes: true,
    dynamicSlippage: false,
    platformFeeBps: +params.platformFeeRate > 0 ? Math.floor(parseFloat(params.platformFeeRate || "0.01") * 10000) : 0,
  }
  if (params.fromTokenAddress === '11111111111111111111111111111111') {
    quoteParams.inputMint = 'So11111111111111111111111111111111111111112'
  }
  if (params.toTokenAddress === '11111111111111111111111111111111') {
    quoteParams.outputMint = 'So11111111111111111111111111111111111111112'
  }

  console.log('quoteParams', quoteParams)
  const quote = await jupClient.quoteGet(quoteParams)
  console.log('quote', quote)

  const feeAccount = await getAssociatedTokenAddress(new PublicKey("So11111111111111111111111111111111111111112"), new PublicKey(params.platformFeeAddress))

  const swapRequest: SwapRequest = {
    dynamicComputeUnitLimit: true,
    quoteResponse: quote,
    userPublicKey: params.userWalletAddress,
    wrapAndUnwrapSol: true,
    dynamicSlippage: true,
    // prioritizationFeeLamports: {
    //   priorityLevelWithMaxLamports: {
    //     maxLamports: 10000,
    //     priorityLevel: params.gasLevel == "fast" ? "veryHigh" : (params.gasLevel == "average" ? "high" : "medium"),
    //   },
    // },
    feeAccount: feeAccount.toBase58(),
  }
  let finalPriFee = 0
  if (params.priFee && parseFloat(params.priFee) > 0) {
    finalPriFee = await getJitoPriorityFee(params.priFee)
  } else if (params.mev) {
    finalPriFee = await getJitoPriorityFee('0.000001')
  }
  if (finalPriFee > 0) {
    swapRequest.prioritizationFeeLamports = {
      jitoTipLamports: finalPriFee
    }
  }

  const swapResponse = await jupClient.swapPost({
    swapRequest,
  });
  const swapTransactionBuf = Uint8Array.from(
    Buffer.from(swapResponse.swapTransaction, "base64")
  );
  const tx = VersionedTransaction.deserialize(swapTransactionBuf);
  return createSolanaSignTransactionInputType(tx, params.userWalletAddress, idempotencyKey)
}

export class CreateTxService {


  async addPriorityFee(tx: SolanaSignTransactionInputType, params: TxTradeRequest): Promise<SolanaSignTransactionInputType> {
    if (!params.priFee || parseFloat(params.priFee || '0') <= 0) {
      return await tx;
    }

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash('finalized');

    // Get priority fee from Jito API
    const jitoPriorityFee = await getJitoPriorityFee(params.priFee);

    // Convert user's priority fee to lamports (1 SOL = 1e9 lamports)
    const userPriorityFeeInLamports = Math.floor(parseFloat(params.priFee || '0') * 1e9);

    // Convert Jito priority fee to lamports (it's already in SOL)
    const jitoPriorityFeeInLamports = Math.floor(jitoPriorityFee * 1e9);

    // Use the minimum of user's fee and Jito's fee
    const finalPriorityFee = Math.min(userPriorityFeeInLamports, jitoPriorityFeeInLamports);

    if (finalPriorityFee <= 0) {
      return tx;
    }

    // Create priority fee instruction using ComputeBudgetProgram
    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: finalPriorityFee * 1000 // Convert lamports to microlamports
    });

    // Add priority fee instruction to transaction
    const txV0 = tx;
    if (!txV0) throw new Error('Transaction is null');
    const versionedTx = txV0.transaction as VersionedTransaction;
    const messageV0 = versionedTx.message;

    // Convert compiled instructions back to TransactionInstructions
    const instructions: TransactionInstruction[] = [
      priorityFeeInstruction,
      ...messageV0.compiledInstructions.map(ci => {
        return new TransactionInstruction({
          programId: messageV0.staticAccountKeys[ci.programIdIndex],
          keys: ci.accountKeyIndexes.map(idx => ({
            pubkey: messageV0.staticAccountKeys[idx],
            isSigner: messageV0.isAccountSigner(idx),
            isWritable: messageV0.isAccountWritable(idx)
          })),
          data: Buffer.from(ci.data)
        });
      })
    ];

    // Get lookup tables
    const lookupTables = await Promise.all(
      messageV0.addressTableLookups.map(async (lookup) => {
        const account = await connection.getAddressLookupTable(lookup.accountKey).then(res => res.value);
        if (!account) throw new Error(`Could not fetch lookup table ${lookup.accountKey.toBase58()}`);
        return account;
      })
    );

    // Create new transaction with priority fee
    const newMessage = new TransactionMessage({
      payerKey: new PublicKey(params.userWalletAddress),
      recentBlockhash: blockhash,
      instructions
    }).compileToV0Message(lookupTables);

    return createSolanaSignTransactionInputType(
      new VersionedTransaction(newMessage),
      params.userWalletAddress,
      txV0.idempotencyKey!
    );
  }

  async createTradeTx(chainType: 'SVM', chainId: string, serialNo: string, params: TxTradeRequest, idempotencyKey: string): Promise<SolanaSignTransactionInputType | EthereumSignTransactionInputType> {
    if (chainType === 'SVM') {
      // console.log('createTradeTx', params)
      let tx = null
      try {
        tx = await createJUPSwapTx(chainType, chainId, serialNo, params, idempotencyKey);
      } catch (error) {
        console.log('createJUPSwapTx error', error)
        throw error
        // console.error('createJUPSwapTx error', error)
        // tx = await createOKXSwapTx(chainType, chainId, params, idempotencyKey);
      }
      return tx
      // return await this.addPriorityFee(tx, params);
    }
    throw new Error(`Unsupported chain type: ${chainType}`)
  }

  async createTransferTx(chainType: 'SVM', _chainId: string, params: TxTransferRequest, idempotencyKey: string): Promise<SolanaSignTransactionInputType | EthereumSignTransactionInputType> {
    if (chainType === 'SVM') {
      console.log('createTransferTx', params)
      console.log('createTransferTx params.userWalletAddress', params.userWalletAddress)
      // Create a Solana transfer transaction (SOL or SPL token)
      const fromPubkey = new PublicKey(params.userWalletAddress);
      const toPubkey = new PublicKey(params.receiverWalletAddress);

      const instructions: TransactionInstruction[] = []

      if (params.tokenAddress === '11111111111111111111111111111111') {
        // SOL transfer
        let lamports = new BN(params.tokenAmount.split(".")[0]).toNumber();

        // Check if destination account exists
        const toAccountInfo = await connection.getAccountInfo(toPubkey);
        if (!toAccountInfo) {
          // Get minimum rent exempt balance
          const minimumRent = await connection.getMinimumBalanceForRentExemption(0);
          if (lamports < minimumRent) {
            lamports = minimumRent + lamports
          }
        }

        // Get recent blockhash
        instructions.push(SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        }))

      } else {
        // SPL token transfer
        const tokenMint = new PublicKey(params.tokenAddress);
        const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, fromPubkey);
        const toTokenAccount = await getAssociatedTokenAddress(tokenMint, toPubkey);

        // Check if destination token account exists
        const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

        // Create instructions array
        // Create destination account if it doesn't exist
        if (!toTokenAccountInfo) {
          instructions.push(
            createAssociatedTokenAccountInstruction(
              fromPubkey,
              toTokenAccount,
              toPubkey,
              tokenMint
            )
          );
        }

        // Add transfer instruction
        const amount = new BN(params.tokenAmount.split(".")[0]).toNumber();
        instructions.push(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromPubkey,
            amount
          )
        );
      }

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      // Convert to versioned transaction
      const versionedTx = new VersionedTransaction(
        new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: blockhash,
          instructions: instructions,
        }).compileToV0Message()
      );

      return createSolanaSignTransactionInputType(versionedTx, params.userWalletAddress, idempotencyKey)

    }

    throw new Error(`Unsupported chain type: ${chainType}`)
  }


}


export const createTxService = new CreateTxService() 