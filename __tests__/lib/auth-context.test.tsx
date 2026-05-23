import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    authApi: {
      getProfile: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    },
  };
});

const mockUser = {
  id: "u1",
  email: "test@example.com",
  username: "testuser",
  phone: "555-0100",
  address: "1 Main St",
  avatar: null,
  created_at: "2024-01-01T00:00:00Z",
};

const mockAuthResponse = { token: "test-jwt", user: mockUser };

describe("AuthProvider / useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("starts unauthenticated when localStorage is empty", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("restores a session stored in localStorage on mount", async () => {
    localStorage.setItem("auth_token", "stored-token");
    vi.mocked(api.authApi.getProfile).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.token).toBe("stored-token");
    expect(result.current.user).toEqual(mockUser);
    expect(api.authApi.getProfile).toHaveBeenCalledWith("stored-token");
  });

  it("clears a session when the stored token is rejected by the API", async () => {
    localStorage.setItem("auth_token", "bad-token");
    vi.mocked(api.authApi.getProfile).mockRejectedValueOnce(new api.ApiError(401, "Invalid"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("login sets user + token and persists token to localStorage", async () => {
    vi.mocked(api.authApi.login).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login("test@example.com", "pass123");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("test-jwt");
    expect(localStorage.getItem("auth_token")).toBe("test-jwt");
  });

  it("login propagates API errors to the caller", async () => {
    vi.mocked(api.authApi.login).mockRejectedValueOnce(new api.ApiError(400, "Invalid credentials"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => { await result.current.login("x@x.com", "wrong"); })
    ).rejects.toBeInstanceOf(api.ApiError);

    expect(result.current.user).toBeNull();
  });

  it("logout clears user, token, and localStorage", async () => {
    localStorage.setItem("auth_token", "stored-token");
    vi.mocked(api.authApi.getProfile).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    act(() => { result.current.logout(); });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("register sets user + token and persists to localStorage", async () => {
    vi.mocked(api.authApi.register).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register({
        email: "new@example.com",
        username: "newuser",
        password: "pass1234",
        password2: "pass1234",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("test-jwt");
    expect(localStorage.getItem("auth_token")).toBe("test-jwt");
  });

  it("updateProfile patches the API and updates user in state", async () => {
    localStorage.setItem("auth_token", "stored-token");
    vi.mocked(api.authApi.getProfile).mockResolvedValueOnce(mockUser);
    const updated = { ...mockUser, username: "renamed", phone: "999-0000" };
    vi.mocked(api.authApi.updateProfile).mockResolvedValueOnce(updated);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toEqual(mockUser));

    await act(async () => {
      await result.current.updateProfile({ username: "renamed", phone: "999-0000" });
    });

    expect(api.authApi.updateProfile).toHaveBeenCalledWith("stored-token", {
      username: "renamed",
      phone: "999-0000",
    });
    expect(result.current.user?.username).toBe("renamed");
    expect(result.current.user?.phone).toBe("999-0000");
  });

  it("updateProfile throws when called without a token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => { await result.current.updateProfile({ username: "x" }); })
    ).rejects.toThrow("Not authenticated");
  });
});
