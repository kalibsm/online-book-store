"use client";

import React from "react";
import { Search, ShoppingCart, User, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImage from "@/public/images/logo.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const MainNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT US" },
    { href: "/books", label: "BOOKS" },
    { href: "/new-release", label: "NEW RELEASE" },
    { href: "/contact", label: "CONTACT US" },
  ];

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 py-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logoImage}
              alt="logo book store"
              className="h-17 w-16 object-cover"
            />
          </Link>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search Books"
                className="pr-10 h-11 bg-[#E0E0E0] border-0 rounded-full"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#393280]" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile" className="text-sm font-medium text-gray-700 hidden md:block hover:text-[#3D2E7C] transition-colors">
                  {user.username}
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  LOGOUT
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                LOGIN
              </Button>
            )}

            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              CART ({cart?.item_count ?? 0})
            </Button>

            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={() => router.push("/wishlist")}
            >
              <Heart className="h-4 w-4" />
              WISHLIST
            </Button>
          </div>
        </div>

        <nav className="flex justify-center items-center gap-12 py-4 border-t border-[#E0E0E0]">
          {navLinks.map((link, i) => (
            <React.Fragment key={link.href}>
              {i > 0 && <div className="h-4 w-px bg-gray-300" />}
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#E86A33] hover:text-[#E86A33]/80"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
