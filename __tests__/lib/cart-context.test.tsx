import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/lib/cart-context";
import * as api from "@/lib/api";

// Mock the auth context so we can control the token without a full AuthProvider
vi.mock("@/lib/auth-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  cartApi: {
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { useAuth } from "@/lib/auth-context";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeBook = (id = "book-1") => ({
  id,
  title: `Book ${id}`,
  author: "Author",
  isbn: id,
  price: "19.99",
  category_id: null,
  category_name: null,
  image: null,
  stock: 5,
  in_stock: true,
  is_featured: false,
  is_new_release: false,
  average_rating: 4,
  published_date: null,
  created_at: "2024-01-01",
});

const makeCart = (overrides = {}) => ({
  id: "cart-1",
  items: [{ book: makeBook(), quantity: 2, subtotal: 39.98 }],
  total: 39.98,
  item_count: 2,
  updated_at: "2024-01-01",
  ...overrides,
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CartProvider / useCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cart is null and API is not called when there is no token", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: null } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cart).toBeNull();
    expect(api.cartApi.get).not.toHaveBeenCalled();
  });

  it("fetches the cart from the API when a token is present", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: "my-token" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart).toBeTruthy());

    expect(api.cartApi.get).toHaveBeenCalledWith("my-token");
    expect(result.current.cart?.item_count).toBe(2);
  });

  it("addToCart calls the API with the right args and updates state", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: "my-token" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());
    const updated = makeCart({ item_count: 3, total: 59.97 });
    vi.mocked(api.cartApi.add).mockResolvedValueOnce(updated);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart).toBeTruthy());

    await act(async () => { await result.current.addToCart("book-2"); });

    expect(api.cartApi.add).toHaveBeenCalledWith("my-token", "book-2", 1);
    expect(result.current.cart?.item_count).toBe(3);
    expect(result.current.cart?.total).toBe(59.97);
  });

  it("addToCart defaults quantity to 1", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: "tok" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());
    vi.mocked(api.cartApi.add).mockResolvedValueOnce(makeCart());

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart).toBeTruthy());

    await act(async () => { await result.current.addToCart("book-x"); });

    expect(api.cartApi.add).toHaveBeenCalledWith("tok", "book-x", 1);
  });

  it("removeFromCart calls the API and updates state", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: "my-token" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());
    const emptyCart = makeCart({ items: [], item_count: 0, total: 0 });
    vi.mocked(api.cartApi.remove).mockResolvedValueOnce(emptyCart);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart?.item_count).toBe(2));

    await act(async () => { await result.current.removeFromCart("book-1"); });

    expect(api.cartApi.remove).toHaveBeenCalledWith("my-token", "book-1");
    expect(result.current.cart?.item_count).toBe(0);
  });

  it("updateQuantity calls the API and updates state", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: "my-token" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());
    const updated = makeCart({ item_count: 5, total: 99.95 });
    vi.mocked(api.cartApi.update).mockResolvedValueOnce(updated);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart).toBeTruthy());

    await act(async () => { await result.current.updateQuantity("book-1", 5); });

    expect(api.cartApi.update).toHaveBeenCalledWith("my-token", "book-1", 5);
    expect(result.current.cart?.item_count).toBe(5);
  });

  it("addToCart throws when called without a token", async () => {
    vi.mocked(useAuth).mockReturnValue({ token: null } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => { await result.current.addToCart("book-1"); })
    ).rejects.toThrow("Must be logged in to add to cart");
  });

  it("cart is cleared when the user logs out (token becomes null)", async () => {
    const useAuthMock = vi.mocked(useAuth);
    useAuthMock.mockReturnValue({ token: "my-token" } as ReturnType<typeof useAuth>);
    vi.mocked(api.cartApi.get).mockResolvedValueOnce(makeCart());

    const { result, rerender } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.cart).toBeTruthy());

    // Simulate logout
    useAuthMock.mockReturnValue({ token: null } as ReturnType<typeof useAuth>);
    rerender();

    await waitFor(() => expect(result.current.cart).toBeNull());
    expect(result.current.cart).toBeNull();
  });
});
