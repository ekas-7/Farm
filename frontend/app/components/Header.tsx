"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#c8cdd3]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/">
          <Image
            src="/agriget-logo.png"
            width={160}
            height={52}
            alt="AgriGet Logo"
            className="h-16 w-auto object-contain transition-transform duration-200 hover:scale-105"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 md:flex">
          {[
            { href: "#listings", label: "Browse Crops" },
            { href: "#how", label: "How It Works" },
            { href: "#join", label: "For Farmers" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="relative py-1 transition-colors hover:text-green-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all after:duration-200 hover:after:w-full"
            >
              {label}
            </a>
          ))}
          <Link
            href="/intelligence"
            className="relative py-1 transition-colors text-green-700 font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            Crop Intelligence
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919877263109"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm font-semibold text-[#1a1f3d] shadow-sm transition hover:bg-green-50 hover:border-green-300 sm:inline-flex"
          >
            <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
            WhatsApp
          </a>
          <Link
            href="/farmer/register"
            className="hidden rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 active:scale-95 sm:inline-block"
          >
            Farmer Login
          </Link>
          <a
            href="#listings"
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
          >
            Browse Crops
          </a>

          {/* Mobile hamburger */}
          <button
            className="ml-1 flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-[#1a1f3d] transition-all duration-200 origin-center ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1a1f3d] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1a1f3d] transition-all duration-200 origin-center ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-60 border-t border-[#c8cdd3]" : "max-h-0"
        } bg-white`}
      >
        <div className="px-6 py-2">
          {[
            { href: "#listings", label: "Browse Crops" },
            { href: "#how", label: "How It Works" },
            { href: "#join", label: "For Farmers" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-gray-600 border-b border-gray-100 last:border-0 hover:text-green-700 transition-colors"
            >
              {label}
            </a>
          ))}
          <Link
            href="/intelligence"
            onClick={() => setMenuOpen(false)}
            className="block py-3 text-sm font-semibold text-green-700 border-b border-gray-100 hover:text-green-800"
          >
            📊 Crop Intelligence
          </Link>
          <Link
            href="/farmer/register"
            onClick={() => setMenuOpen(false)}
            className="mt-1 mb-1 block py-3 text-sm font-semibold text-green-700 border-b border-gray-100 hover:text-green-800"
          >
            🌾 Farmer Portal
          </Link>
          <a
            href="https://wa.me/919877263109"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 mb-2 flex items-center gap-2 text-sm font-semibold text-green-700"
          >
            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  );
}
