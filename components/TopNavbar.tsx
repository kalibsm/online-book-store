import React from "react";
import {
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const TopNavbar = () => {
  return (
    <div className="bg-[#4A2B7C] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Phone Number */}
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+7 9959022345</span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Youtube className="h-4 w-4" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
