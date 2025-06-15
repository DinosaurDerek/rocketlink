import { test, expect } from "@playwright/test";

const mockedTokens = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 30000,
    image: "/btc.png",
    price_change_percentage_24h: 1,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    current_price: 2000,
    image: "/eth.png",
    price_change_percentage_24h: 2,
  },
];

const mockedHistory = [
  { timestamp: 1, price: 29500 },
  { timestamp: 2, price: 30000 },
];

test.describe("Rocketlink", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      "https://api.coingecko.com/api/v3/coins/markets*",
      (route) => {
        route.fulfill({ json: mockedTokens });
      }
    );

    await page.route(
      "https://api.coingecko.com/api/v3/coins/*/market_chart*",
      (route) => {
        route.fulfill({
          json: {
            prices: mockedHistory.map(({ timestamp, price }) => [
              timestamp,
              price,
            ]),
          },
        });
      }
    );

    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  });

  test("displays the token list and default selection", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Top Tokens" })
    ).toBeVisible();

    const tokenCards = await page.locator('[data-testid="token-card"]').all();
    expect(tokenCards.length).toBe(2);

    const firstCard = tokenCards[0];
    await expect(firstCard).toHaveClass(/selected/);
  });

  test("selecting a token updates main content area", async ({ page }) => {
    const secondCard = page.locator('[data-testid="token-card"]').nth(1);
    const tokenName = await secondCard.getByTestId("token-name").innerText();

    await expect(secondCard).not.toHaveClass(/selected/);

    await secondCard.click();

    await expect(secondCard).toHaveClass(/selected/);
    await expect(page.getByTestId("token-heading")).toContainText(tokenName);
    await expect(page.getByText("Current price:")).toBeVisible();
    await expect(page.getByTestId("token-chart")).toBeVisible();
  });

  test("chart remains stable when switching tokens rapidly", async ({
    page,
  }) => {
    const cards = page.locator('[data-testid="token-card"]');
    await cards.nth(1).click();
    await cards.nth(0).click();
    await expect(page.getByTestId("token-chart")).toBeVisible();
  });
});
