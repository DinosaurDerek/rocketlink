import { render, screen, waitFor } from "@/utils/test-utils";
import AppContent from "@/components/app-content/AppContent";
import { TokenProvider } from "@/context/TokenContext";
import * as fetchPriceHistory from "@/utils/fetchPriceHistory";

const mockToken = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "/btc.png",
  current_price: 30000,
};

jest.mock("@/components/TokenChart", () => () => <div>Chart</div>);
jest.mock("@/components/Loader", () => () => <div>Loader</div>);
jest.mock("@/components/Message", () => ({ text }) => <div>{text}</div>);

function renderWithTokenContext(ui, token = mockToken) {
  return render(<TokenProvider initialToken={token}>{ui}</TokenProvider>);
}

describe("AppContent", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("shows message if no token is selected", () => {
    renderWithTokenContext(<AppContent />, null);
    expect(
      screen.getByText("Select a token to view details")
    ).toBeInTheDocument();
  });

  test("renders loader, then chart on successful fetch", async () => {
    jest
      .spyOn(fetchPriceHistory, "fetchPriceHistory")
      .mockResolvedValueOnce([{ price: 1, timestamp: 1 }]);
    renderWithTokenContext(<AppContent />);

    expect(screen.getByText("Loader")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Chart")).toBeInTheDocument());
  });

  test("renders error message on fetch failure", async () => {
    // Silence expected errors to keep test output clean
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(fetchPriceHistory, "fetchPriceHistory")
      .mockRejectedValueOnce(new Error("Fetch failed"));
    renderWithTokenContext(<AppContent />);

    await waitFor(() =>
      expect(screen.getByText("Fetch failed")).toBeInTheDocument()
    );
  });
});
