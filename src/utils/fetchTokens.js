import { retryFetchJSON } from "@/utils/retryFetchJSON";

export async function fetchTokens(setError) {
  return retryFetchJSON({
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
    setError,
    notOkMessage: "Failed to fetch tokens.",
  });
}
