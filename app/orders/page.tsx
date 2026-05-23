"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { ordersApi, Order } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    ordersApi
      .list(token)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <Package className="h-12 w-12 text-[#3D2E7C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-2">Sign in to view your orders</h1>
          <p className="text-muted-foreground mb-6">Track your purchases and order history.</p>
          <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[#F5F1ED] py-10 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#3D2E7C]">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your purchases</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-5 flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                  <div className="h-4 bg-muted rounded w-20" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#3D2E7C] mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                When you place an order, it will appear here.
              </p>
              <Link href="/books">
                <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90">Browse books</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                const shortId = order.id.slice(-8).toUpperCase();

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block border rounded-xl bg-white p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      {/* Left: meta */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-[#3D2E7C]">
                            Order #{shortId}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>

                        <div className="text-sm text-muted-foreground space-y-0.5">
                          <p>
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p>
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                            {order.items.length > 0 && (
                              <span className="text-gray-400">
                                {" "}· {order.items.map((i) => i.book_title).slice(0, 2).join(", ")}
                                {order.items.length > 2 && ` +${order.items.length - 2} more`}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right: total + arrow */}
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[#FF6B4A]">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#3D2E7C] transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
