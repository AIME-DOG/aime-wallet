
import { Connection } from '@solana/web3.js';
import * as dotenv from 'dotenv';

dotenv.config();

const solanaRpcUrl = process.env.SOLANA_RPC_URL;
if (!solanaRpcUrl) {
  throw new Error('Missing SOLANA_RPC_URL in environment variables');
}

export const connection = new Connection(solanaRpcUrl);
