## 🚀 Rocketlink

**Rocketlink** is a solo-built crypto dashboard built with Next.js for the Chromion Hackathon. It builds upon an earlier prototype, Token Dash, extending it with smart contract integration and live on-chain monitoring. It uses Chainlink Price Feeds and Chainlink Automation on Avalanche Fuji to provide real-time price tracking via smart contracts.

**Tech Stack**: Next.js, React, Emotion, Ethers.js, Hardhat, Solidity, Chainlink, Jest, Playwright (basic)

### 🧠 What users can do

- View real-time token prices from Chainlink

- Explore historical token price charts (1-week view)

- Set and manage token-specific price thresholds on-chain

- Check if a threshold was breached (based on last on-chain update)

- Manually trigger an on-chain price update (for testing or demonstration)

## 🔗 Live Demo

[Rocketlink — deployed on Vercel](https://rocketlink.vercel.app/)

## ⚙️ Features

- Real-time token prices from Chainlink

- Historical price chart using CoinGecko

- On-chain price thresholds (user-configurable)

- Price monitoring with Chainlink Automation

- Deployed to Avalanche Fuji testnet

- Built-in wallet connect and Ethers.js integration

## 📝 Notes

- Only the first three tokens — AVAX, LINK, and ETH — are connected to Chainlink Automation and update prices automatically. The others are static for demo purposes.

- The app uses Avalanche Fuji’s free public RPC endpoint (https://api.avax-test.network/ext/bc/C/rpc). While reliable for individual use or demo purposes, it may struggle with higher traffic or multiple simultaneous users due to rate limits and lack of dedicated resources.

- This app uses the free tier of the CoinGecko API for historical price visualization, which has strict rate limits. This may cause delays loading the price chart. Error messages are displayed in the UI when rate limits are hit.

- Contracts are built with the assumption that all Chainlink feeds return prices with 8 decimal places.

- Some browser wallet extensions may conflict with each other. If you're having trouble initiating transactions, try disabling all but your primary wallet extension.

- Token logos are static and may not reflect dynamic token state.

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/rocketlink.git
cd rocketlink

# Install dependencies
yarn install

# Run the dev server
yarn dev

# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e

# Compile contracts
yarn compile

# Deploy to Avalanche Fuji
yarn deploy:fuji
```

### 🔧 Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `yarn dev`         | Start the local Next.js development server |
| `yarn build`       | Build the production app                   |
| `yarn start`       | Start the production server                |
| `yarn lint`        | Run ESLint                                 |
| `yarn test`        | Run unit tests (Jest)                      |
| `yarn test:e2e`    | Run end-to-end tests (Playwright)          |
| `yarn compile`     | Compile smart contracts (Hardhat)          |
| `yarn deploy:fuji` | Deploy contracts to Avalanche Fuji testnet |
| `yarn postcompile` | Generate ABI files after compilation       |

## ✅ Future Enhancements from Token Dash (original prototype)

- Improve mobile UX (better layout for token list + chart)

- Add chart timeframes (1D, 1W, 1M, 6M, 1Y, YTD)

- Add query string support for token selection

- Add light/dark mode toggle

- Add skeleton or smoother animation for token list load

- Fix Emotion/Jest/Playwright compatibility to enable component tests

- Remove need for top-level Emotion import

## 🧠 Rocketlink-Specific Future Enhancements

- Add alert notifications (email or in-app) when a threshold is breached

- Write tests for PriceMonitor

- Refactor to use a single contract to manage all token thresholds instead of deploying one contract per token

- Use WAGMI for wallet connection and better extension compatibility

- Use updatedAt from contracts to compare Chainlink vs PriceMonitor freshness

- Consider SSR or hybrid rendering to eliminate initial white flash from client-only hydration

- Add support for other networks (e.g. Ethereum Sepolia)

- More accurate error handling (e.g. rejected tx vs on-chain revert)

- Switch to dedicated RPC endpoint for better reliability

## 🙌 Submission

Built for the Chromion Hackathon — June 2025

## 📄 License

MIT
