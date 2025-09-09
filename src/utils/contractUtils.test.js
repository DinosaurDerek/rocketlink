import { Contract, BrowserProvider } from "ethers";

import {
  fetchTokenFeedPrices,
  fetchPriceMonitorData,
  updatePriceAndStatus,
  setThresholdAndGetStatus,
  getWritableContract,
  getReadableContract,
  readPriceFromFeed,
} from "@/utils/contractUtils";

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  return {
    ...original,
    Contract: jest.fn(),
    JsonRpcProvider: jest.fn(() => ({})),
    BrowserProvider: jest.fn(() => ({
      getSigner: jest.fn().mockResolvedValue("mockSigner"),
    })),
  };
});

describe("fetchTokenFeedPrices", () => {
  it("fetches prices and updates tokens", async () => {
    const mockLatestRoundData = jest.fn().mockResolvedValue({
      answer: BigInt("50000000000"), // 500 with 8 decimals
    });
    Contract.mockImplementation(() => ({
      latestRoundData: mockLatestRoundData,
    }));

    const tokens = [
      { id: "token1", feedAddress: "0x123" },
      { id: "token2", feedAddress: "0x456" },
    ];
    const setTokens = jest.fn();
    const setError = jest.fn();
    const setSelectedId = jest.fn();

    await fetchTokenFeedPrices(
      tokens,
      setTokens,
      setError,
      null,
      setSelectedId
    );

    expect(setTokens).toHaveBeenCalledWith([
      { id: "token1", feedAddress: "0x123", price: 500 },
      { id: "token2", feedAddress: "0x456", price: 500 },
    ]);
    expect(setError).toHaveBeenCalledWith(null);
    expect(setSelectedId).toHaveBeenCalledWith("token1");
  });
});

describe("fetchPriceMonitorData", () => {
  it("fetches monitor data and updates state", async () => {
    Contract.mockImplementation(() => ({
      isThresholdBreached: jest.fn().mockResolvedValue(true),
      threshold: jest.fn().mockResolvedValue(BigInt("100000000")),
      lastPrice: jest.fn().mockResolvedValue(BigInt("120000000")),
      lastUpdatedAt: jest.fn().mockResolvedValue(BigInt("1721300000")),
    }));

    const setState = jest.fn();
    const setError = jest.fn();

    await fetchPriceMonitorData("token1", setState, setError);

    expect(setState).toHaveBeenCalledWith({
      breached: true,
      threshold: 1,
      lastPrice: 1.2,
      lastUpdatedAt: 1721300000000,
    });
    expect(setError).toHaveBeenCalledWith("");
  });
});

describe("updatePriceAndStatus", () => {
  beforeEach(() => {
    // mock MetaMask presence
    window.ethereum = {
      request: jest.fn().mockResolvedValue({}),
    };
  });

  afterEach(() => {
    delete global.window.ethereum;
  });

  it("updates price and returns new values", async () => {
    Contract.mockImplementation(() => ({
      updatePrice: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
      lastPrice: jest.fn().mockResolvedValue(BigInt("123456789")),
      isThresholdBreached: jest.fn().mockResolvedValue(false),
    }));

    const result = await updatePriceAndStatus("ethereum");

    expect(result).toEqual({
      lastPrice: 1.23456789,
      breached: false,
    });
  });
});

describe("setThresholdAndGetStatus", () => {
  beforeEach(() => {
    // mock MetaMask presence
    window.ethereum = {
      request: jest.fn().mockResolvedValue({}),
    };
  });

  afterEach(() => {
    delete global.window.ethereum;
  });

  it("sets threshold and returns new status", async () => {
    Contract.mockImplementation(() => ({
      setThreshold: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
      isThresholdBreached: jest.fn().mockResolvedValue(true),
    }));

    const result = await setThresholdAndGetStatus("ethereum", 1.23);

    expect(result).toEqual({ breached: true });
  });
});

describe("getWritableContract", () => {
  beforeEach(() => {
    // mock MetaMask presence
    window.ethereum = {
      request: jest.fn().mockResolvedValue({}),
    };
  });

  afterEach(() => {
    delete global.window.ethereum;
  });

  it("returns a contract with signer", async () => {
    const mockSigner = {};
    const mockSetError = jest.fn();
    BrowserProvider.mockImplementation(() => ({
      getSigner: jest.fn().mockResolvedValue(mockSigner),
    }));
    Contract.mockImplementation(() => ({ name: "mockContract" }));

    const contract = await getWritableContract("ethereum", mockSetError);

    expect(contract).toStrictEqual({ name: "mockContract" });
  });

  it("throws if MetaMask not available", async () => {
    delete global.window.ethereum;

    await expect(getWritableContract("ethereum")).rejects.toThrow(
      "MetaMask not available"
    );
  });
});

describe("getReadableContract", () => {
  it("returns a readable contract", () => {
    Contract.mockImplementation(() => ({ name: "mockContract" }));

    const contract = getReadableContract("ethereum");
    expect(contract).toStrictEqual({ name: "mockContract" });
  });
});

describe("readPriceFromFeed", () => {
  it("reads price and returns normalized value", async () => {
    Contract.mockImplementation(() => ({
      latestRoundData: jest.fn().mockResolvedValue({
        answer: BigInt("987654321"),
      }),
    }));

    const price = await readPriceFromFeed("0xfeed");
    expect(price).toBe(9.87654321);
  });
});

describe("bigNumberToNumber precision", () => {
  it("converts 8-decimal BigInt to exact string using formatUnits", () => {
    const { formatUnits } = require("ethers");
    const raw = BigInt("123456789012345000"); // 1234567890.12345 with 8 decimals
    const str = formatUnits(raw, 8);
    expect(str).toBe("1234567890.12345");
  });
});
