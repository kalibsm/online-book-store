import { describe, it, expect, vi, beforeEach } from "vitest";
import { bookImageUrl, ApiError, authApi, booksApi, cartApi } from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFetch(status: number, body: unknown, ok = status < 400) {
  return vi.fn().mockResolvedValueOnce({
    ok,
    status,
    statusText: "Mock status",
    json: async () => body,
  } as Response);
}

// ── bookImageUrl ──────────────────────────────────────────────────────────────

describe("bookImageUrl", () => {
  it("returns /placeholder.svg for null", () => {
    expect(bookImageUrl(null)).toBe("/placeholder.svg");
  });

  it("returns absolute URLs unchanged", () => {
    const url = "https://cdn.example.com/cover.jpg";
    expect(bookImageUrl(url)).toBe(url);
  });

  it("prepends the API base URL to relative paths", () => {
    const result = bookImageUrl("/media/books/cover.jpg");
    expect(result).toMatch(/^http.+\/media\/books\/cover\.jpg$/);
  });
});

// ── ApiError ─────────────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("is an instance of Error", () => {
    expect(new ApiError(404, "Not found")).toBeInstanceOf(Error);
  });

  it("stores status and message", () => {
    const err = new ApiError(401, "Unauthorized");
    expect(err.status).toBe(401);
    expect(err.message).toBe("Unauthorized");
    expect(err.name).toBe("ApiError");
  });
});

// ── fetch wrapper ─────────────────────────────────────────────────────────────

describe("fetch wrapper", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("throws ApiError on a non-ok response", async () => {
    global.fetch = makeFetch(404, { detail: "Not found" }, false);
    await expect(booksApi.get("missing-id")).rejects.toBeInstanceOf(ApiError);
  });

  it("uses the detail field from the error body as the message", async () => {
    global.fetch = makeFetch(401, { detail: "Invalid token" }, false);
    try {
      await booksApi.get("x");
    } catch (err) {
      expect((err as ApiError).status).toBe(401);
      expect((err as ApiError).message).toBe("Invalid token");
    }
  });

  it("returns undefined on 204 No Content", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, status: 204 } as Response);
    const result = await cartApi.remove("token", "book-id");
    expect(result).toBeUndefined();
  });

  it("attaches an Authorization header when a token is provided", async () => {
    global.fetch = makeFetch(200, { id: "1", books: [] });
    await cartApi.get("my-jwt");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/cart/"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer my-jwt" }),
      })
    );
  });

  it("omits Authorization header when no token provided", async () => {
    global.fetch = makeFetch(200, { count: 0, page: 1, total_pages: 1, results: [] });
    await booksApi.list();
    const headers = (vi.mocked(global.fetch).mock.calls[0][1] as RequestInit)
      ?.headers as Record<string, string>;
    expect(headers?.Authorization).toBeUndefined();
  });
});

// ── authApi ───────────────────────────────────────────────────────────────────

describe("authApi", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("login POSTs to /api/auth/login/ with email and password", async () => {
    global.fetch = makeFetch(200, { token: "jwt", user: {} });
    await authApi.login("user@test.com", "pass123");
    const [url, opts] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/auth/login/");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body as string)).toEqual({ email: "user@test.com", password: "pass123" });
  });

  it("register POSTs the full registration payload", async () => {
    global.fetch = makeFetch(200, { token: "jwt", user: {} });
    await authApi.register({
      email: "a@b.com",
      username: "alice",
      password: "secret123",
      password2: "secret123",
      phone: "555-0100",
    });
    const body = JSON.parse(
      (vi.mocked(global.fetch).mock.calls[0][1] as RequestInit).body as string
    );
    expect(body.email).toBe("a@b.com");
    expect(body.username).toBe("alice");
    expect(body.phone).toBe("555-0100");
  });

  it("updateProfile sends PATCH with changed fields", async () => {
    global.fetch = makeFetch(200, { id: "1" });
    await authApi.updateProfile("my-token", { username: "newname", phone: "999" });
    const [url, opts] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/auth/profile/");
    expect(opts.method).toBe("PATCH");
    expect(JSON.parse(opts.body as string)).toMatchObject({ username: "newname", phone: "999" });
  });
});

// ── booksApi.list ─────────────────────────────────────────────────────────────

describe("booksApi.list", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  const emptyPage = { count: 0, page: 1, total_pages: 1, results: [] };

  it("fetches /api/books/ with no query string when no filters given", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list();
    const url = vi.mocked(global.fetch).mock.calls[0][0] as string;
    expect(url).toMatch(/\/api\/books\/$/);
  });

  it("appends search param", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list({ search: "gatsby" });
    expect(vi.mocked(global.fetch).mock.calls[0][0]).toContain("search=gatsby");
  });

  it("appends featured=true param", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list({ featured: true });
    expect(vi.mocked(global.fetch).mock.calls[0][0]).toContain("featured=true");
  });

  it("appends new_release=true param", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list({ new_release: true });
    expect(vi.mocked(global.fetch).mock.calls[0][0]).toContain("new_release=true");
  });

  it("omits undefined filters", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list({ search: undefined, category: undefined });
    const url = vi.mocked(global.fetch).mock.calls[0][0] as string;
    expect(url).toMatch(/\/api\/books\/$/);
  });

  it("combines multiple filters into the query string", async () => {
    global.fetch = makeFetch(200, emptyPage);
    await booksApi.list({ search: "react", category: "tech", ordering: "-price", page: 2 });
    const url = vi.mocked(global.fetch).mock.calls[0][0] as string;
    expect(url).toContain("search=react");
    expect(url).toContain("category=tech");
    expect(url).toContain("ordering=-price");
    expect(url).toContain("page=2");
  });
});
