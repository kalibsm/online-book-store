"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  CheckCircle,
  Pencil,
  X,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync form when user loads
  useEffect(() => {
    if (user) {
      setForm({ username: user.username, phone: user.phone, address: user.address });
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEdit() {
    setSaveError("");
    setSaved(false);
    setEditing(true);
  }

  function handleCancel() {
    if (user) setForm({ username: user.username, phone: user.phone, address: user.address });
    setSaveError("");
    setEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      await updateProfile({
        username: form.username,
        phone: form.phone,
        address: form.address,
      });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <UserIcon className="h-12 w-12 text-[#3D2E7C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-6">Manage your account details and preferences.</p>
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

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-lg px-4">
          <div className="h-24 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-32 bg-muted rounded-2xl" />
        </div>
      </main>
    );
  }

  const initials = user.username.slice(0, 2).toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[#F5F1ED] py-10 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#3D2E7C] flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3D2E7C]">{user.username}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {user.email} &middot; Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">

          {/* Profile info / edit form */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-[#3D2E7C]">Profile Information</h2>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1.5 text-sm text-[#3D2E7C] hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-700"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-muted-foreground font-normal">(cannot be changed)</span>
                  </label>
                  <Input value={user.email} disabled className="bg-muted/40 text-muted-foreground" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 0100"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default shipping address <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, Country"
                    rows={2}
                  />
                </div>

                {saveError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="submit" className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90" disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="divide-y">
                <Row icon={<UserIcon className="h-4 w-4" />} label="Username" value={user.username} />
                <Row icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                <Row
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={user.phone || <span className="text-muted-foreground italic">Not set</span>}
                />
                <Row
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={user.address || <span className="text-muted-foreground italic">Not set</span>}
                />
              </dl>
            )}

            {saved && (
              <div className="px-6 py-3 bg-green-50 border-t border-green-200 flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle className="h-4 w-4" />
                Profile updated successfully.
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-[#3D2E7C]">My Activity</h2>
            </div>
            <div className="divide-y">
              <Link
                href="/orders"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Package className="h-5 w-5 text-[#3D2E7C]" />
                  <span className="font-medium">My Orders</span>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-[#3D2E7C] transition-colors">
                  View →
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="h-5 w-5 text-[#FF6B4A] fill-[#FF6B4A]" />
                  <span className="font-medium">My Wishlist</span>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-[#3D2E7C] transition-colors">
                  View →
                </span>
              </Link>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-700">Account</h2>
            </div>
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Sign out</p>
                <p className="text-sm text-muted-foreground">You will be logged out of your account.</p>
              </div>
              <Button
                variant="outline"
                className="gap-2 border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      <span className="mt-0.5 text-[#3D2E7C] shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
        <dd className="text-sm font-medium text-gray-800 break-words">{value}</dd>
      </div>
    </div>
  );
}
