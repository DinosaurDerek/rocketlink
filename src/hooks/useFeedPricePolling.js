import { usePolling } from "@/hooks/usePolling";
import { fetchTokenFeedPrices } from "@/utils/contractUtils";
import { TOKENS } from "@/constants";

export function useFeedPricePolling(
  selectedId,
  setTokens,
  setError,
  setSelectedId
) {
  usePolling({
    intervalMs: 45000,
    callback: () =>
      fetchTokenFeedPrices(
        TOKENS,
        setTokens,
        setError,
        selectedId,
        setSelectedId
      ),
    deps: [selectedId, setTokens, setError, setSelectedId],
  });
}
