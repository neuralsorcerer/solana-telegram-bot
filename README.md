# Solana Token Purchase Telegram Bot

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Starting the Bot](#starting-the-bot)
  - [Purchasing SOL](#purchasing-sol)
  - [Swapping Tokens](#swapping-tokens)
  - [Setting Up Dollar-Cost Averaging (DCA)](#setting-up-dollar-cost-averaging-dca)
  - [Setting Price Alerts](#setting-price-alerts)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

The Solana Token Purchase Telegram Bot is a comprehensive solution that allows users to seamlessly purchase Solana tokens through Telegram. Integrating with Mercuryo for fiat-to-crypto on-ramping and Jupiter API for token swaps, this bot simplifies crypto investments, making them accessible and convenient. Key features include:

- Seamless fiat-to-SOL on-ramping
- Integration with major Solana DEX aggregators for token swaps
- Dollar-Cost Averaging (DCA) functionality
- Price movement alerts with buy/sell confirmations
- User-friendly Telegram interface for all operations

## Features

- **Fiat-to-Crypto On-Ramping:** Purchase SOL using fiat currency via Mercuryo.
- **Token Swapping:** Swap SOL for other Solana tokens using Jupiter API.
- **DCA Strategies:** Set up automated, recurring purchases of SOL.
- **Price Alerts:** Receive notifications when a token reaches a specified price.
- **Secure Wallet Generation:** Automatic creation of a Solana wallet upon starting the bot.
- **User Data Encryption:** Secure storage of sensitive user data using encryption.

## Prerequisites

Before setting up the application, ensure you have the following:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB instance (local or hosted)
- Mercuryo API credentials
- Telegram account
- Telegram Bot Token (obtained via BotFather)
- Basic understanding of command-line operations

## Installation

### Clone the Repository

```bash
git clone https://github.com/neuralsorcerer/solana-telegram-bot.git
cd solana-telegram-bot
```

### Install Dependencies

```bash
npm install
```

## Configuration

### Create Environment Variables

Create a `.env` file in the backend directory:

```bash
touch .env
```

Open the `.env` file and add the following configurations:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MERCURYO_API_KEY=your_mercuryo_api_key
MERCURYO_API_SECRET=your_mercuryo_api_secret
MONGODB_URI=your_mongodb_connection_string
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ENCRYPTION_KEY=your_32_byte_hex_encryption_key
```

### Instructions:

- **TELEGRAM_BOT_TOKEN:** Obtain this from the BotFather on Telegram.
- **MERCURYO_API_KEY** and **MERCURYO_API_SECRET:** Sign up on Mercuryo and get your API credentials.
- **MONGODB_URI:** Provide your MongoDB connection string. If running locally, it might be `mongodb://localhost:27017/solana_bot`.
- **SOLANA_RPC_URL:** Use the default unless you have a custom Solana RPC endpoint.
- **ENCRYPTION_KEY:** Generate a 32-byte (256-bit) encryption key in hexadecimal format (64 hex characters). This key is used to encrypt users' private keys.

Important: Keep the `.env` file secure and never commit it to version control.

### Initialize the Database

Ensure MongoDB is running. If you're using a local MongoDB instance, start it with:

```bash
mongod
```

If using a hosted MongoDB service (like MongoDB Atlas), ensure your connection string in `.env` is correct.

## Running the Application

### Compile TypeScript to JavaScript

```bash
npx tsc
```

### Start the Application

```bash
node dist/index.js
```

For development purposes, you can use `nodemon` to automatically restart the application when changes are detected:

```bash
npm install -g nodemon
nodemon dist/index.js
```

## Usage

### Starting the Bot

1. Open Telegram and search for your bot using its username.
2. Click on Start or send the `/start` command.

Example Output:

```
Welcome to the Solana Purchase Bot!
Your wallet address is: Your_Solana_Wallet_Address
```

### Purchasing SOL

Use the `/buy` command followed by the amount in USD.

Command Format:

```bash
/buy <amount_in_usd>
```

Example:

```bash
/buy 100
```

Bot Response:

```
Please complete your purchase here: [Payment Link]
```

Click on the payment link to proceed with the transaction via Mercuryo.

### Swapping Tokens

Use the `/swap` command to swap SOL for another Solana token.

Command Format:

```bash
/swap <input_mint_address> <output_mint_address> <amount_in_lamports>
```

Parameters:

- `input_mint_address`: The mint address of the token you want to swap from (e.g., SOL).
- `output_mint_address`: The mint address of the token you want to swap to.
- `amount_in_lamports`: The amount you want to swap, in lamports (1 SOL = 1,000,000,000 lamports).

Example:

```bash
/swap So11111111111111111111111111111111111111112 <TokenMintAddress> 1000000000
```

Bot Response:

```
Best quote found: X tokens for 1 SOL input. Confirm swap?
[Confirm Button]
```

Click Confirm to proceed with the swap.

### Setting Up Dollar-Cost Averaging (DCA)

Use the `/dca` command to set up a DCA strategy.

Command Format:

```bash
/dca <amount_in_usd> <cron_expression>
```

Example:

Set up a DCA to purchase $50 every day at 9 AM:

```bash
/dca 50 0 9 * * *
```

Bot Response:

```
Your DCA strategy has been set up.
```

Understanding Cron Expressions:

```
* * * * * *
| | | | | |
| | | | | +--- Day of the Week (0-7) (Sunday=0 or 7)
| | | | +----- Month (1-12)
| | | +------- Day of the Month (1-31)
| | +--------- Hour (0-23)
| +----------- Minute (0-59)
+------------- Second (0-59)
```

### Setting Price Alerts

Use the `/setalert` command to set up price movement alerts.

Command Format:

```bash
/setalert <token_id> <above|below> <price_in_usd>
```

Example:

Set an alert for Solana when it goes above $150:

```bash
/setalert solana above 150
```

Bot Response:

```
Your price alert has been set.
```

## Security Considerations

- **Protect Your Bot Token:** Ensure your Telegram bot token is kept secret.
- **Encryption Key:** The `ENCRYPTION_KEY` is used to encrypt users' private keys. Keep it secure.
- **Do Not Share Private Keys:** The bot manages private keys securely. Do not expose or share them.
- **Use Secure Connections:** Ensure all connections to APIs and databases use secure protocols (HTTPS, SSL/TLS).
- **Regular Updates:** Keep dependencies up to date to patch security vulnerabilities.
- **Regulatory Compliance:** Ensure compliance with KYC/AML regulations in your jurisdiction.

## Troubleshooting

- **Bot Not Responding:** Ensure the bot is running without errors. Check logs for any issues.
- **Database Connection Errors:** Verify that MongoDB is running and the `MONGODB_URI` is correct.
- **Invalid Commands:** Ensure you're using the correct command formats as specified.
- **Cron Expression Errors:** Use a cron expression validator if you're unsure about the format.
- **API Errors:** Check your API keys and ensure they are valid and have the necessary permissions.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Telegram Bot API: https://core.telegram.org/bots/api
- Mercuryo API: https://mercuryo.io/developers
- Jupiter API: https://docs.jup.ag/
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
- CoinGecko API: https://www.coingecko.com/en/api/documentation
