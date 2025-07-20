import { useEffect, useRef } from "react";

export function usePolling({
  intervalMs,
  callback,
  visibility = true,
  deps = [],
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    const startPolling = () => {
      callback();
      intervalRef.current = setInterval(callback, intervalMs);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        stopPolling();
        return;
      }
      stopPolling();
    };

    if (!visibility || document.visibilityState === "visible") {
      startPolling();
    }

    if (visibility) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      stopPolling();
      if (visibility) {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
