import { withRetries } from "./withRetries";

describe("withRetries", () => {
  it("resolves on first try", async () => {
    const fn = jest.fn().mockResolvedValue("success");
    const setError = jest.fn();

    const result = await withRetries(fn, setError);

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith(null);
  });

  it("retries on failure and eventually succeeds", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("recovered");
    const setError = jest.fn();

    const result = await withRetries(fn, setError, 2, 0);

    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(setError).toHaveBeenNthCalledWith(1, expect.any(Error));
    expect(setError).toHaveBeenNthCalledWith(2, null);
  });

  it("throws after all retries fail", async () => {
    const error = new Error("fail");
    const fn = jest.fn().mockRejectedValue(error);
    const setError = jest.fn();

    await expect(withRetries(fn, setError, 3, 0)).rejects.toThrow("fail");

    expect(fn).toHaveBeenCalledTimes(3);
    expect(setError).toHaveBeenCalledTimes(3);
  });
});
