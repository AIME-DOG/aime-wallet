import { PrivyClient } from '@privy-io/server-auth'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
  throw new Error('Missing Privy credentials in environment variables')
}

export const privyClient = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET,
  {
    walletApi: {
      authorizationPrivateKey: process.env.PRIVY_APP_AUTH_KEY
    }
  }
)
