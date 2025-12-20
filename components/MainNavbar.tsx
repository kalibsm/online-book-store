"use client";
import React from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  SeparatorVertical,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import logoImage from "@/public/images/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainNavbar = () => {
  const pathname = usePathname();
  console.log("============================");
  console.log("pathname:", pathname);
  console.log("============================");

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 py-6">
          {/* Logo - circular placeholder */}
          <Link href="/" className="flex-shrink-0">
            {/* <div className="h-16 w-16 rounded-full bg-gray-300" /> */}
            <Image
              src={logoImage}
              alt="logo book store"
              className="h-17 w-16 object-cover "
            />
          </Link>

          {/* Search Bar - centered */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <User className="h-4 w-4" />
              ACCOUNT
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ShoppingCart className="h-4 w-4" />
              CART (08)
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Heart className="h-4 w-4" />
              WISHLIST
            </Button>
          </div>
        </div>

        <nav className="flex justify-center items-center gap-12 py-4 border-t border-[#E0E0E0]">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === "/"
                ? "text-[#E86A33] hover:text-[#E86A33]/80"
                : "text-gray-700 hover:text-gray-900"
            } transition-colors`}
          >
            HOME
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <Link
            href="/about"
            className={`text-sm font-medium ${
              pathname === "/about"
                ? "text-[#E86A33] hover:text-[#E86A33]/80"
                : "text-gray-700 hover:text-gray-900"
            } transition-colors`}
          >
            ABOUT US
          </Link>
          <div className="h-4 w-px bg-gray-300" />{" "}
          <Link
            href="/books"
            className={`text-sm font-medium ${
              pathname === "/books"
                ? "text-[#E86A33] hover:text-[#E86A33]/80"
                : "text-gray-700 hover:text-gray-900"
            } transition-colors`}
          >
            BOOKS
          </Link>
          <div className="h-4 w-px bg-gray-300" />{" "}
          <Link
            href="/new-release"
            className={`text-sm font-medium ${
              pathname === "/new-release"
                ? "text-[#E86A33] hover:text-[#E86A33]/80"
                : "text-gray-700 hover:text-gray-900"
            } transition-colors`}
          >
            NEW RELEASE
          </Link>
          <div className="h-4 w-px bg-gray-300" />{" "}
          <Link
            href="/contact"
            className={`text-sm font-medium ${
              pathname === "/contact"
                ? "text-[#E86A33] hover:text-[#E86A33]/80"
                : "text-gray-700 hover:text-gray-900"
            } transition-colors`}
          >
            CONTACT US
          </Link>
          {/* <div className="h-4 w-px bg-gray-300" />{" "} */}
          {/* <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            BLOG
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
