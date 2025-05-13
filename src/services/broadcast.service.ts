import base58 from 'bs58'
import { connection } from '../config/sol.rpc'
import axios from 'axios'
export class BroadcastService {
  async broadcastTransaction(chainType: 'SVM' | 'evm', _chainId: number, signedTx: string): Promise<string> {
    if (chainType === 'SVM') {
      const txHash = await connection.sendRawTransaction(base58.decode(signedTx));
      return txHash;
    }
    throw new Error(`Unsupported chain type: ${chainType}`)
  }

  async jitoBroadcastTransaction(signedTx: string): Promise<string> {
    const jitoURL = "https://mainnet.block-engine.jito.wtf/api/v1/transactions";
    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "sendTransaction",
      params: [signedTx],
    };
    try {
      const response = await axios.post(jitoURL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("jito response", response.data)
      return response.data.result;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Jito Bundle Error: cannot send.");
    }
  }
}

export const broadcastService = new BroadcastService() 