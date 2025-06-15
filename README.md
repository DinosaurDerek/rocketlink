## Token Dash

**Token Dash** is a small demo app and code sample for a crypto dashboard built with Next.js. It displays a list of top tokens with basic price data and renders a historical price chart for the selected token. It's built with React, Emotion, and Next.js.

## Demo

[Token Dash Demo — deployed via Vercel.](https://token-dash.vercel.app/)

## Notes

- This app uses the free tier of the CoinGecko API, which has strict rate limits. This may cause brief delays or failed fetches when switching tokens quickly or refreshing often.
- Error messages are displayed in the UI when rate limits are hit.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/token-dash.git

# Install dependencies
cd token-dash
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
