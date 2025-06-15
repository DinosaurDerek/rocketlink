import { retryFetchJSON } from "@/utils/retryFetchJSON";

export async function fetchPriceHistory(tokenId, setError, days = 7) {
  const json = await retryFetchJSON({
    url: `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`,
    setError,
    notOkMessage: "Failed to fetch price history.",
    typeErrorMessage:
      "Latest data couldn't be fetched. This may be due to rate limiting. Please wait or try again in a minute.",
  });

  return json.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
}
