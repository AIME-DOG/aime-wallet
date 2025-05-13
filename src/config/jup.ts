import { createJupiterApiClient } from '@jup-ag/api';
import * as dotenv from 'dotenv'

dotenv.config()


export const jupClient = createJupiterApiClient({
    basePath: process.env.JUP_BASE_PATH,
    apiKey: process.env.JUP_API_KEY,
}); // config is optional
