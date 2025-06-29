import {
  formatPrice,
  formatHeadingPrice,
  formatCompactPrice,
  formatPercent,
  formatDateTime,
} from "./format";

describe("format utils", () => {
  test("formatPrice", () => {
    expect(formatPrice(123456.789)).toBe("$123,456.79");
    expect(formatPrice(9.1234)).toBe("$9.1234");
    expect(formatPrice(0.1)).toBe("$0.10");
  });

  test("formatHeadingPrice", () => {
    expect(formatHeadingPrice(12345.6789)).toBe("$12,345.6789");
    expect(formatHeadingPrice(9.87654321)).toBe("$9.87654321");
  });

  test("formatCompactPrice", () => {
    expect(formatCompactPrice(2_500_000)).toBe("2.50M");
    expect(formatCompactPrice(12_000)).toBe("12.00k");
    expect(formatCompactPrice(500)).toBe("500");
    expect(formatCompactPrice(50)).toBe("50.00");
    expect(formatCompactPrice(0.1234)).toBe("0.123");
    expect(formatCompactPrice(0.0004567)).toBe("0.0005");
  });

  test("formatPercent", () => {
    expect(formatPercent(2.5)).toBe("2.50%");
    expect(formatPercent(0.3456)).toBe("0.35%");
  });

  test("formatDateTime", () => {
    expect(formatDateTime("1750871003561")).toMatch(
      /Jun 25, 2025, \d{1,2}:\d{2} (AM|PM)/
    );
  });
});
