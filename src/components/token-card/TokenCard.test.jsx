import { render, screen, fireEvent } from "@/utils/test-utils";
import TokenCard from "@/components/token-card/TokenCard";
import { theme } from "@/theme";

const token = {
  name: "Bitcoin",
  image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
  current_price: 69000,
  price_change_percentage_24h: 2.5,
};

describe("TokenCard", () => {
  it("renders token name and price data", () => {
    render(<TokenCard token={token} onClick={() => {}} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText(/\$69,000/)).toBeInTheDocument();
    expect(screen.getByText(/\(2.50%\)/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", token.name);
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<TokenCard token={token} onClick={handleClick} />);

    fireEvent.click(screen.getByTestId("token-card"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has selected styles when isSelected is true", () => {
    render(<TokenCard token={token} onClick={() => {}} isSelected />);

    const button = screen.getByTestId("token-card");
    expect(button).toHaveStyle(`backgroundColor: ${theme.colors.primary}`);
    expect(button).toBeInTheDocument();
  });
});
