## 🚀 Rocketlink

**Rocketlink** is a solo-built crypto dashboard demo built with Next.js, designed for the Chromion Hackathon. It integrates Chainlink price feeds and smart contract automation on the Avalanche Fuji testnet.

The app displays real-time token prices, renders historical price charts, and lets users set custom price alerts using Chainlink Automation. It’s built with React, Emotion, and Ethers.js for a clean, Web3-native frontend experience.

## Demo

[Rocketlink Demo — deployed via Vercel.](https://rocketlink.vercel.app/)

## Notes

- This app uses the free tier of the CoinGecko API, which has strict rate limits. This may cause brief delays or failed fetches when switching tokens quickly or refreshing often.
- Error messages are displayed in the UI when rate limits are hit.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/rocketlink.git

# Install dependencies
cd rocketlink
npm install

# Run the dev server
npm run dev

# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e
```

## TODOs

- Improve mobile UX (better layout for token list + chart)
- Add query string support for token selection
- Add multiple chart timeframes (1D, 1W, 1M, 6M, 1Y, YTD)
- Add light/dark mode toggle
- Add skeleton or smoother animation for token list load
- Remove need for top of file emotion/react import

## License

MIT
