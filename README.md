# AIME Wallet Service

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
