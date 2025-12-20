import React from "react";
import Link from "next/link";
import {
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import footerImage from "@/public/images/footerbg.png";
import Image from "next/image";
import logoImage from "@/public/images/logo.png";
import footerImage1 from "@/public/images/footerImage1.png";
import footerImage2 from "@/public/images/footerImage2.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#FFE5E5] via-[#F5FFFE] to-[#FFF4E5] py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left column - Logo and description */}
          <div>
            <div className="w-20 h-20 mb-4">
              <Image
                src={logoImage}
                alt="logo book store"
                className="object-cover h-17 w-16"
              />
            </div>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6">
              Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
            <div className="flex items-center space-x-6 gap-4">
              <Link
                href="#"
                className="text-[#E85D4A] hover:text-[#d54d3a] transition-colors"
              >
                <Facebook className="h-8 w-8" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-[#E85D4A] hover:text-[#d54d3a] transition-colors"
              >
                <Linkedin className="h-8 w-8 " />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-[#E85D4A] hover:text-[#d54d3a] transition-colors"
              >
                <Twitter className="h-8 w-8 " />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-[#E85D4A] hover:text-[#d54d3a] transition-colors"
              >
                <Youtube className="h-8 w-8 " />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Middle column - Company links */}
          <div>
            <h4 className="text-[#E85D4A] font-bold text-lg mb-6 uppercase tracking-wide">
              COMPANY
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  BOOKS
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/ebooks"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  EBOOKS
                </Link>
              </li> */}
              <li>
                <Link
                  href="/new-release"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  NEW RELEASE
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  CONTACT US
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/blog"
                  className="text-[#3E3E6E] hover:text-[#E85D4A] transition-colors font-medium"
                >
                  BLOG
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Right column - Latest News */}
          <div>
            <h4 className="text-[#E85D4A] font-bold text-lg mb-6 uppercase tracking-wide">
              LATEST NEWS
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Image
                  src={footerImage1}
                  alt="News thumbnail"
                  width={100}
                  height={70}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-[#E85D4A] font-semibold mb-1 text-sm">
                    Nostrud exercitation
                  </h5>
                  <p className="text-[#4A4A4A] text-xs mb-2 leading-relaxed">
                    Nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </p>
                  <div className="flex items-center gap-1 text-[#F5B041] text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>15 April 2022</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Image
                  src={footerImage2}
                  alt="News thumbnail"
                  width={100}
                  height={70}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-[#E85D4A] font-semibold mb-1 text-sm">
                    Nostrud exercitation
                  </h5>
                  <p className="text-[#4A4A4A] text-xs mb-2 leading-relaxed">
                    Nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </p>
                  <div className="flex items-center gap-1 text-[#F5B041] text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>15 April 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-300 text-sm">
          <p className="text-[#4A4A4A] mb-4 md:mb-0">
            &copy; 2025 SMohamed. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="text-[#E85D4A] hover:text-[#d54d3a] transition-colors font-medium"
            >
              Privacy
            </Link>
            <span className="text-[#4A4A4A]">|</span>
            <Link
              href="/terms"
              className="text-[#4A4A4A] hover:text-[#E85D4A] transition-colors font-medium"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
