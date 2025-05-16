# AIME Wallet Service
<img src=".assets/LOGO+AIME-light.png" alt="AIME" style="zoom: 50%;" align="center"/>



AIME.DOG: The First Social Multi-Chain DEX | Explore Alpha First

AIME is the first social-driven multi-chain DEX. It aims to create a globally user-friendly decentralized exchange, allowing users to integrate trading, socializing, discussion, and copy trading into one seamless experience.

AIME adopts an MPC wallet structure, ensuring that users truly own their assets.

Want to read this in English? Go here
希望查看 [中文文档](README.md)？

<p align="center">
  <a href="https://docs.aime.dog/">Docs</a> - <a href="https://aime.dog/">AIME</a> - <a href="https://aime.dog/invite">Invite</a> - <a href="https://aime.dog/channel">Channel</a>
</p>

<p align="center">
    <img src ="https://img.shields.io/badge/version-0.1.0-blueviolet.svg"/>
    <img src ="https://img.shields.io/badge/platform-windows|linux|macos-yellow.svg"/>
    <img src ="https://img.shields.io/badge/database-mysql|8.0+-orange.svg"/>
    <img src ="https://img.shields.io/badge/nodejs-20-blue.svg" />
</p>


## Original Intent

AIME is dedicated to providing users with a secure, simple, and easy-to-use DEX. We prioritize the security of users' assets above all else, while ensuring users enjoy an experience similar to that of centralized exchanges.

### Wallet Selection

We conducted a comprehensive comparison of many wallets, using the decentralization philosophy as the baseline to offer the safest wallet for users.

After extensive research and discussion, we ruled out centralized custody methods, Web3Auth-type MPC wallets, and also decided against EOA wallets like Metamask. Ultimately, we chose a wallet like Privy, which allows user control and authorization for operations such as copy trading and order placement. Users also participate in the MPC process.

## Why Choose Privy and JUP

AIME is a DEX that places the highest priority on the security of user assets. The development, construction, and selection of wallets have always been approached with great caution.

Privy is an outstanding company whose wallet adopts an MPC architecture and has passed multiple independent security audits by companies such as Cure53, Zellic, and Doyensec.

It holds SOC2 Type I and II security certifications.

Privy uses a non-custodial architecture, meaning users have complete control over their assets, and no one can directly manipulate them.

When AIME needs to use user assets for trading optimization, copy trading, or other needs, it requires user authorization before initiating transactions on behalf of the user.

This process allows users to revoke authorization at any time, keeping the management of assets entirely in their hands.

Privy also employs the TEE (Trusted Execution Environment) model, where keys are divided and distributed across different security boundaries, and can only be temporarily reconstructed in a secure execution environment to perform specific operations.

------

JUP's core goal is to provide Solana users with the best trade execution and price discovery. As a liquidity aggregator, it connects liquidity from various decentralized exchanges (DEXs) on Solana, allowing users to exchange tokens at the best prices with minimal slippage.

It can aggregate liquidity from multiple DEXs (such as Raydium, Orca, Serum, etc.) in the Solana ecosystem in real-time. Through intelligent routing algorithms, it analyzes prices and liquidity across different DEXs to find the optimal trading path for users.

Features:
- Intelligent order routing
- Efficient execution speed
- Deep integration with the Solana ecosystem
- Open API and SDK

------

AIME uses JUP's core API to build the user's transaction into unsignData, then signs it with Privy to obtain signTransaction, and finally broadcasts the transaction directly to the blockchain. This ensures that no one can access any user information in the process. Through JUP, high-quality buildData can also be obtained.

A robust and scalable blockchain wallet service built with Fastify, providing transaction management and blockchain interaction capabilities. This service integrates with Privy for wallet authentication and Jupiter for Solana DEX aggregation.

## Overview

This service provides a RESTful API for handling blockchain transactions, including transfers and trades across different blockchain networks. It's built with TypeScript and Fastify, offering high performance and type safety. The service leverages Privy for secure wallet authentication and Jupiter for efficient Solana token swaps.

## Features

- Multi-chain support for different blockchain networks
- Transaction creation and signing
- Transaction broadcasting
- MEV (Maximal Extractable Value) support for SVM chain
- Health check endpoint
- CORS enabled
- Comprehensive error handling
- Logging system
- **Privy Integration**: Secure wallet authentication and management
- **Jupiter Integration**: Solana DEX aggregation for optimal token swaps

## Architecture

The service follows a clean architecture pattern with the following components:

### Controllers
- `TransactionController`: Handles HTTP requests for transaction operations
  - Transfer operations
  - Trade operations

### Services
- `TransactionService`: Core business logic for transaction processing
- `SignService`: Handles transaction signing
- `CreateTxService`: Creates different types of transactions
- `BroadcastService`: Manages transaction broadcasting to blockchain networks

### External Integrations
- **Privy**: Wallet authentication and management
  - Secure wallet API integration
  - Authentication key management
- **Jupiter**: Solana DEX aggregation
  - Optimal route finding for token swaps
  - API-based integration for trade execution

## API Endpoints

### Health Check
```
GET /health
```
Returns the service status.

### Transaction Endpoints
- Transfer transactions
- Trade transactions with MEV support

## Environment Variables

Required environment variables:
- `PORT`: Server port (default: 3001)
- `PRIVY_APP_ID`: Privy application ID
- `PRIVY_APP_SECRET`: Privy application secret
- `PRIVY_APP_AUTH_KEY`: Privy authorization private key
- `JUP_BASE_PATH`: Jupiter API base path
- `JUP_API_KEY`: Jupiter API key

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with the following required configurations:
```env
PORT=3001
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
PRIVY_APP_AUTH_KEY=your_privy_auth_key
JUP_BASE_PATH=your_jupiter_base_path
JUP_API_KEY=your_jupiter_api_key
```

3. Start the server:
```bash
npm start
```

## Error Handling

The service implements comprehensive error handling with:
- HTTP status codes
- Error messages
- Transaction hash verification
- Detailed logging

## Security

- CORS protection
- Environment variable configuration
- Secure transaction signing
- Transaction hash verification
- Privy authentication integration
- Secure API key management

## Dependencies

- Fastify: Web framework
- TypeScript: Programming language
- dotenv: Environment configuration
- @privy-io/server-auth: Privy authentication
- @jup-ag/api: Jupiter DEX aggregation
- Additional blockchain-specific dependencies

## License

[Add your license information here]
