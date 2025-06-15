import { withRetries } from "@/utils/withRetries";

export async function retryFetchJSON({
  url,
  setError,
  retries = 3,
  delay = 30000,
  notOkMessage = "Failed to fetch data.",
  typeErrorMessage = "Request failed. This may be due to rate limiting. Please wait or try again in a minute.",
}) {
  return withRetries(
    async () => {
      try {
        const res = await fetch(url);

        if (res.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait a minute and try again."
          );
        }

        if (!res.ok) {
          throw new Error(notOkMessage);
        }

        return res.json();
      } catch (err) {
        if (err instanceof TypeError) {
          throw new Error(typeErrorMessage);
        }
        throw err;
      }
    },
    setError,
    retries,
    delay
  );
}
