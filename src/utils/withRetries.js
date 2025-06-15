export async function withRetries(fn, setError, retries = 3, delay = 30000) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await fn();
      setError?.(null);

      return result;
    } catch (error) {
      lastError = error;
      setError?.(error);

      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
}
