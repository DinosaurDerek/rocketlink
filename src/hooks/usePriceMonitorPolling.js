import { usePolling } from "@/hooks/usePolling";
import { fetchPriceMonitorData } from "@/utils/contractUtils";

export function usePriceMonitorPolling(selectedToken, setState, setError) {
  usePolling({
    intervalMs: 30000,
    callback: () => {
      if (selectedToken?.id) {
        fetchPriceMonitorData(selectedToken.id, setState, setError);
      }
    },
    deps: [selectedToken?.id, setState, setError],
  });
}
