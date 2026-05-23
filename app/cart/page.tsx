"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import { ordersApi, bookImageUrl, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

type CheckoutStep = "cart" | "address" | "success";

export default function CartPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [shippingAddress, setShippingAddress] = useState(user?.address ?? "");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleUpdateQuantity(bookId: string, qty: number) {
    if (qty < 1) return;
    setUpdatingId(bookId);
    try { await updateQuantity(bookId, qty); }
    catch { /* ignore */ }
    finally { setUpdatingId(null); }
  }

  async function handleRemove(bookId: string) {
    setRemovingId(bookId);
    try { await removeFromCart(bookId); }
    catch { /* ignore */ }
    finally { setRemovingId(null); }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setOrderError("");
    setPlacing(true);
    try {
      await ordersApi.checkout(token, shippingAddress, notes || undefined);
      setStep("success");
    } catch (err) {
      setOrderError(err instanceof ApiError ? err.message : "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // Not logged in
  if (!token) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <ShoppingBag className="h-12 w-12 text-[#3D2E7C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-2">Sign in to view your cart</h1>
          <p className="text-muted-foreground mb-6">You need an account to add and manage cart items.</p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90" onClick={() => router.push("/login")}>
              Sign in
            </Button>
            <Button variant="outline" onClick={() => router.push("/register")}>
              Create account
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Order success
  if (step === "success") {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-2">Order placed!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been received. We&apos;ll process it shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90"
              onClick={() => router.push("/orders")}
            >
              View my orders
            </Button>
            <Button variant="outline" onClick={() => router.push("/books")}>
              Keep browsing
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[#F5F1ED] py-10 border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#3D2E7C] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
          <h1 className="text-4xl font-bold text-[#3D2E7C]">
            Your Cart{" "}
            {cart && cart.item_count > 0 && (
              <span className="text-lg font-normal text-muted-foreground">
                ({cart.item_count} item{cart.item_count !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4 max-w-2xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-xl">
                  <div className="w-20 h-28 bg-muted rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="text-center py-24">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#3D2E7C] mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any books yet.
              </p>
              <Link href="/books">
                <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90">Browse books</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const isUpdating = updatingId === item.book.id;
                  const isRemoving = removingId === item.book.id;

                  return (
                    <div
                      key={item.book.id}
                      className={`flex gap-4 p-4 border rounded-xl bg-white transition-opacity ${
                        isRemoving ? "opacity-40" : ""
                      }`}
                    >
                      {/* Book cover */}
                      <Link href={`/books/${item.book.id}`} className="shrink-0">
                        <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={bookImageUrl(item.book.image)}
                            alt={item.book.title}
                            fill
                            className="object-cover"
                            unoptimized={!item.book.image}
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/books/${item.book.id}`}>
                          <h3 className="font-semibold text-[#3D2E7C] line-clamp-1 hover:underline">
                            {item.book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-3">{item.book.author}</p>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {/* Quantity controls */}
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              className="px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-40"
                              onClick={() => handleUpdateQuantity(item.book.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-4 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">
                              {isUpdating ? "…" : item.quantity}
                            </span>
                            <button
                              className="px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-40"
                              onClick={() => handleUpdateQuantity(item.book.id, item.quantity + 1)}
                              disabled={isUpdating}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Subtotal + remove */}
                          <div className="flex items-center gap-4">
                            <span className="text-base font-bold text-[#FF6B4A]">
                              ${item.subtotal.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemove(item.book.id)}
                              disabled={isRemoving}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          ${parseFloat(item.book.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary / Checkout */}
              <div className="lg:col-span-1">
                {step === "cart" ? (
                  <div className="border rounded-xl bg-white p-6 space-y-4 sticky top-4">
                    <h2 className="text-xl font-bold text-[#3D2E7C]">Order Summary</h2>

                    <div className="space-y-2 text-sm">
                      {cart.items.map((item) => (
                        <div key={item.book.id} className="flex justify-between text-muted-foreground">
                          <span className="line-clamp-1 flex-1 pr-2">
                            {item.book.title} × {item.quantity}
                          </span>
                          <span className="shrink-0">${item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#FF6B4A]">${cart.total.toFixed(2)}</span>
                    </div>

                    <Button
                      className="w-full bg-[#3D2E7C] hover:bg-[#3D2E7C]/90"
                      size="lg"
                      onClick={() => setStep("address")}
                    >
                      Proceed to Checkout
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Free shipping on all orders
                    </p>
                  </div>
                ) : (
                  /* Checkout address form */
                  <div className="border rounded-xl bg-white p-6 space-y-5 sticky top-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-[#3D2E7C]">Shipping Details</h2>
                      <button
                        onClick={() => setStep("cart")}
                        className="text-sm text-muted-foreground hover:text-[#3D2E7C] transition-colors"
                      >
                        ← Back
                      </button>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="123 Main St, City, Country"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order notes{" "}
                          <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any delivery instructions…"
                          rows={3}
                        />
                      </div>

                      <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-[#FF6B4A]">${cart.total.toFixed(2)}</span>
                      </div>

                      {orderError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          {orderError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-[#FF6B4A] hover:bg-[#FF6B4A]/90"
                        size="lg"
                        disabled={placing}
                      >
                        {placing ? "Placing order…" : "Place Order"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
