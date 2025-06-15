import { retryFetchJSON } from "./retryFetchJSON";

global.fetch = jest.fn();

describe("retryFetchJSON", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns JSON on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 123 }),
    });
    const setError = jest.fn();

    const result = await retryFetchJSON({
      url: "/api/test",
      setError,
      retries: 1,
      delay: 0,
    });

    expect(result).toEqual({ data: 123 });
    expect(setError).toHaveBeenCalledWith(null);
  });

  it("throws custom error for 429", async () => {
    fetch.mockResolvedValueOnce({ status: 429, ok: false });
    const setError = jest.fn();

    await expect(
      retryFetchJSON({ url: "/api/test", setError, retries: 1, delay: 0 })
    ).rejects.toThrow(/Rate limit exceeded/);

    expect(setError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("throws custom error for fetch TypeError", async () => {
    fetch.mockRejectedValueOnce(new TypeError("Network error"));
    const setError = jest.fn();

    await expect(
      retryFetchJSON({ url: "/api/test", setError, retries: 1, delay: 0 })
    ).rejects.toThrow(/rate limiting/);

    expect(setError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("throws notOkMessage on non-429 failure", async () => {
    fetch.mockResolvedValueOnce({ status: 500, ok: false });
    const setError = jest.fn();

    await expect(
      retryFetchJSON({
        url: "/api/test",
        setError,
        retries: 1,
        delay: 0,
        notOkMessage: "Custom error",
      })
    ).rejects.toThrow("Custom error");

    expect(setError).toHaveBeenCalledWith(expect.any(Error));
  });
});
