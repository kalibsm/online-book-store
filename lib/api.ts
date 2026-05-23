const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  avatar: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  book_count: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: string;
  category_id: string | null;
  category_name: string | null;
  image: string | null;
  stock: number;
  in_stock: boolean;
  is_featured: boolean;
  is_new_release: boolean;
  average_rating: number;
  published_date: string | null;
  created_at: string;
}

export interface BookDetail extends Book {
  description: string;
  reviews: Review[];
  category: Category | null;
}

export interface Review {
  id: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  item_count: number;
  updated_at: string;
}

export interface OrderItem {
  book_id: string | null;
  book_title: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
}

export interface Order {
  id: string;
  user_email: string;
  status: string;
  total_amount: string;
  shipping_address: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  books: Book[];
}

export interface BooksResponse {
  count: number;
  page: number;
  total_pages: number;
  results: Book[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BookFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  new_release?: boolean;
  ordering?: string;
  page?: number;
}

// ── Error ─────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.detail ?? JSON.stringify(data);
    } catch {
      // keep statusText
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    password2: string;
    phone?: string;
    address?: string;
  }) =>
    request<AuthResponse>("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getProfile: (token: string) => request<User>("/api/auth/profile/", {}, token),

  updateProfile: (token: string, data: Partial<Pick<User, "username" | "phone" | "address" | "avatar">>) =>
    request<User>(
      "/api/auth/profile/",
      { method: "PATCH", body: JSON.stringify(data) },
      token
    ),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => request<Category[]>("/api/categories/"),
  get: (slug: string) => request<Category>(`/api/categories/${slug}/`),
};

// ── Books ─────────────────────────────────────────────────────────────────────

export const booksApi = {
  list: (filters: BookFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.featured) params.set("featured", "true");
    if (filters.new_release) params.set("new_release", "true");
    if (filters.ordering) params.set("ordering", filters.ordering);
    if (filters.page) params.set("page", String(filters.page));
    const qs = params.toString();
    return request<BooksResponse>(`/api/books/${qs ? `?${qs}` : ""}`);
  },

  get: (id: string) => request<BookDetail>(`/api/books/${id}/`),

  getReviews: (id: string) => request<Review[]>(`/api/books/${id}/reviews/`),

  addReview: (id: string, token: string, data: { rating: number; comment?: string }) =>
    request<Review>(
      `/api/books/${id}/reviews/`,
      { method: "POST", body: JSON.stringify(data) },
      token
    ),

  deleteReview: (id: string, token: string) =>
    request<void>(`/api/books/${id}/reviews/`, { method: "DELETE" }, token),
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: (token: string) => request<Cart>("/api/cart/", {}, token),

  add: (token: string, bookId: string, quantity = 1) =>
    request<Cart>(
      "/api/cart/",
      { method: "POST", body: JSON.stringify({ book_id: bookId, quantity }) },
      token
    ),

  update: (token: string, bookId: string, quantity: number) =>
    request<Cart>(
      "/api/cart/",
      { method: "PATCH", body: JSON.stringify({ book_id: bookId, quantity }) },
      token
    ),

  remove: (token: string, bookId: string) =>
    request<Cart>(
      "/api/cart/",
      { method: "DELETE", body: JSON.stringify({ book_id: bookId }) },
      token
    ),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: (token: string) => request<Order[]>("/api/orders/", {}, token),

  get: (token: string, id: string) => request<Order>(`/api/orders/${id}/`, {}, token),

  checkout: (token: string, shipping_address: string, notes?: string) =>
    request<Order>(
      "/api/orders/checkout/",
      { method: "POST", body: JSON.stringify({ shipping_address, notes }) },
      token
    ),

  cancel: (token: string, id: string) =>
    request<Order>(`/api/orders/${id}/cancel/`, { method: "PATCH" }, token),
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: (token: string) => request<Wishlist>("/api/wishlist/", {}, token),

  add: (token: string, bookId: string) =>
    request<Wishlist>(
      "/api/wishlist/",
      { method: "POST", body: JSON.stringify({ book_id: bookId }) },
      token
    ),

  remove: (token: string, bookId: string) =>
    request<void>(
      "/api/wishlist/",
      { method: "DELETE", body: JSON.stringify({ book_id: bookId }) },
      token
    ),
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function bookImageUrl(image: string | null): string {
  if (!image) return "/placeholder.svg";
  if (image.startsWith("http")) return image;
  return `${BASE_URL}${image}`;
}
