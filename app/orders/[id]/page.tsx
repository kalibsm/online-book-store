"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, FileText, Clock } from "lucide-react";
import { ordersApi, Order, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

// Steps shown in the progress tracker (exclude cancelled — handled separately)
const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-sm font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <p className="text-sm text-gray-500 italic">This order was cancelled.</p>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === STATUS_STEPS.length - 1;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-[#3D2E7C] border-[#3D2E7C] text-white"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-xs mt-1 capitalize font-medium ${
                  done ? "text-[#3D2E7C]" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 ${
                  idx < currentIdx ? "bg-[#3D2E7C]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!token) return;
    ordersApi
      .get(token, id)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 403))
          setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [token, id]);

  async function handleCancel() {
    if (!token || !order) return;
    setCancelError("");
    setCancelling(true);
    try {
      const updated = await ordersApi.cancel(token, order.id);
      setOrder(updated);
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-4">Sign in to view this order</h1>
          <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-8" />
          <div className="h-8 bg-muted rounded w-48 mb-6" />
          <div className="h-16 bg-muted rounded mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-muted rounded" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#3D2E7C] mb-2">Order not found</h1>
          <p className="text-muted-foreground mb-6">
            This order doesn&apos;t exist or doesn&apos;t belong to your account.
          </p>
          <Link href="/orders">
            <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90">Back to orders</Button>
          </Link>
        </div>
      </main>
    );
  }

  const shortId = order.id.slice(-8).toUpperCase();
  const canCancel = order.status === "pending" || order.status === "confirmed";
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="bg-[#F5F1ED] py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/orders" className="hover:text-[#3D2E7C] transition-colors">
              My Orders
            </Link>
            <span>/</span>
            <span className="text-[#3D2E7C] font-medium">Order #{shortId}</span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#3D2E7C] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>

          {/* Order header */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#3D2E7C]">Order #{shortId}</h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Status timeline */}
          <div className="bg-white border rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
              Order Progress
            </h2>
            <OrderTimeline status={order.status} />
          </div>

          {/* Items */}
          <div className="bg-white border rounded-xl mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-[#3D2E7C]">
                Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-6 py-3 text-muted-foreground font-medium">Book</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Qty</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Unit price</th>
                  <th className="text-right px-6 py-3 text-muted-foreground font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.book_title}</td>
                    <td className="px-4 py-4 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      ${parseFloat(item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-muted/20">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right text-xl font-bold text-[#FF6B4A]">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Shipping & Notes */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[#3D2E7C]" />
                <h2 className="font-semibold text-[#3D2E7C]">Shipping address</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address}</p>
            </div>

            {order.notes && (
              <div className="bg-white border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#3D2E7C]" />
                  <h2 className="font-semibold text-[#3D2E7C]">Order notes</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Cancel */}
          {canCancel && (
            <div className="border border-red-200 rounded-xl p-5 bg-red-50">
              <h3 className="font-semibold text-red-700 mb-1">Cancel this order</h3>
              <p className="text-sm text-red-600 mb-4">
                You can cancel while the order is {order.status}. This cannot be undone.
              </p>
              {cancelError && (
                <p className="text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg px-3 py-2 mb-3">
                  {cancelError}
                </p>
              )}
              <Button
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-100 bg-transparent"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
