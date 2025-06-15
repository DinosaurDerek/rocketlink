import { render, screen, waitFor } from "@/utils/test-utils";
import TokenList from "@/components/token-list/TokenList";
import { TokenProvider } from "@/context/TokenContext";
import * as fetchUtils from "@/utils/fetchTokens";

const mockTokens = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
  { id: "ethereum", name: "Ethereum", symbol: "eth" },
];

jest.mock(
  "@/components/token-card/TokenCard",
  () =>
    ({ token, onClick, isSelected }) =>
      (
        <div onClick={() => onClick()}>
          {token.name} {isSelected ? "(Selected)" : ""}
        </div>
      )
);
jest.mock("@/components/Loader", () => () => <div>Loader</div>);
jest.mock("@/components/Message", () => ({ text }) => <div>{text}</div>);

describe("TokenList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders list of token cards", async () => {
    jest.spyOn(fetchUtils, "fetchTokens").mockResolvedValueOnce(mockTokens);
    render(
      <TokenProvider>
        <TokenList />
      </TokenProvider>
    );

    await waitFor(() => expect(screen.getByText(/Bitcoin/i)));
    expect(screen.getByText(/Ethereum/i)).toBeInTheDocument();
  });

  test("renders error message and loader on fetch failure", async () => {
    // Silence expected errors to keep test output clean
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(fetchUtils, "fetchTokens")
      .mockRejectedValueOnce(new Error("Fetch failed"));
    render(
      <TokenProvider>
        <TokenList />
      </TokenProvider>
    );

    await waitFor(() => expect(screen.getByText("Fetch failed")));
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });
});
