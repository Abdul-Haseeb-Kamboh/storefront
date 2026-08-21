import type { Product } from "@spree/sdk";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/products/ProductCard";

const mockAddItem = vi.fn();

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/wishlist/WishlistButton", () => ({
  WishlistButton: () => <button type="button">wishlist</button>,
}));

vi.mock("@/contexts/StoreContext", () => ({
  useStore: () => ({ currency: "USD", locale: "en", loading: false }),
}));

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({ addItem: mockAddItem, updating: false }),
}));

// Minimal product fixtures — cast to Product for component props
const baseProduct = {
  id: "prod-1",
  name: "Classic T-Shirt",
  slug: "classic-t-shirt",
  purchasable: true,
  default_variant_id: "variant-master",
  thumbnail_url: "https://example.com/shirt.jpg",
  price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
    compare_at_amount_in_cents: null,
    display_compare_at_amount: null,
  },
  original_price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
  },
} as unknown as Product;

const saleProduct = {
  id: "prod-2",
  name: "Sale T-Shirt",
  slug: "sale-t-shirt",
  purchasable: true,
  default_variant_id: "variant-sale",
  thumbnail_url: "https://example.com/shirt.jpg",
  price: {
    display_amount: "$15.00",
    amount_in_cents: 1500,
    compare_at_amount_in_cents: null,
    display_compare_at_amount: null,
  },
  original_price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
  },
} as unknown as Product;

const outOfStockProduct = {
  id: "prod-3",
  name: "Sold Out Item",
  slug: "sold-out-item",
  purchasable: false,
  default_variant_id: "variant-sold-out",
  thumbnail_url: "https://example.com/shirt.jpg",
  price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
    compare_at_amount_in_cents: null,
    display_compare_at_amount: null,
  },
  original_price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
  },
} as unknown as Product;

const noImageProduct = {
  id: "prod-4",
  name: "No Image Product",
  slug: "no-image",
  purchasable: true,
  default_variant_id: "variant-no-image",
  thumbnail_url: null,
  price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
    compare_at_amount_in_cents: null,
    display_compare_at_amount: null,
  },
  original_price: {
    display_amount: "$25.00",
    amount_in_cents: 2500,
  },
} as unknown as Product;

const noPriceProduct = {
  id: "prod-5",
  name: "Members Product",
  slug: "members-product",
  purchasable: true,
  default_variant_id: "variant-members",
  thumbnail_url: "https://example.com/shirt.jpg",
  price: null,
  original_price: null,
} as unknown as Product;

describe("ProductCard", () => {
  it("shows loading state only on the clicked quick add button", () => {
    let resolveAdd: (() => void) | undefined;
    const pendingAdd = new Promise<void>((resolve) => {
      resolveAdd = resolve;
    });
    mockAddItem.mockImplementationOnce(() => pendingAdd);

    render(
      <>
        <ProductCard product={baseProduct} basePath="/us/en" />
        <ProductCard product={saleProduct} basePath="/us/en" />
      </>,
    );

    const [firstButton, secondButton] = screen.getAllByRole("button", {
      name: "addToCart",
    });
    fireEvent.click(firstButton);

    expect(firstButton).toHaveAttribute("aria-label", "adding");
    expect(secondButton).toHaveAttribute("aria-label", "addToCart");

    resolveAdd?.();
  });

  it("shows quick add button for purchasable products", () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    expect(
      screen.getByRole("button", { name: "addToCart" }),
    ).toBeInTheDocument();
  });

  it("does not show quick add button when price is hidden", () => {
    render(<ProductCard product={noPriceProduct} basePath="/us/en" />);

    expect(
      screen.queryByRole("button", { name: "addToCart" }),
    ).not.toBeInTheDocument();
  });

  it("adds default variant to cart from quick add button", async () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    fireEvent.click(screen.getByRole("button", { name: "addToCart" }));
    expect(mockAddItem).toHaveBeenCalledWith("variant-master", 1);
  });

  it("renders product name and price", () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    expect(screen.getByText("Classic T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("links to the product page", () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/us/en/products/classic-t-shirt");
  });

  it("shows Sale badge when on sale", () => {
    render(<ProductCard product={saleProduct} basePath="/us/en" />);

    expect(screen.getByText("sale")).toBeInTheDocument();
  });

  it("shows strikethrough price when on sale", () => {
    render(<ProductCard product={saleProduct} basePath="/us/en" />);

    expect(screen.getByText("$15.00")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    const strikethrough = screen.getByText("$25.00");
    expect(strikethrough).toHaveClass("line-through");
  });

  it("does not show Sale badge for regular price products", () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    expect(screen.queryByText("sale")).not.toBeInTheDocument();
  });

  it("shows Out of Stock for non-purchasable products", () => {
    render(<ProductCard product={outOfStockProduct} basePath="/us/en" />);

    expect(screen.getByText("outOfStock")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "addToCart" }),
    ).not.toBeInTheDocument();
  });

  it("renders image when thumbnail_url is provided", () => {
    render(<ProductCard product={baseProduct} basePath="/us/en" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/shirt.jpg");
    expect(img).toHaveAttribute("alt", "Classic T-Shirt");
  });

  it("renders placeholder when no thumbnail", () => {
    render(<ProductCard product={noImageProduct} basePath="/us/en" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("uses empty basePath by default", () => {
    render(<ProductCard product={baseProduct} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/classic-t-shirt");
  });
});
