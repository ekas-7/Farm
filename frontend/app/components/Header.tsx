import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/">
        <Image
          src="/agriget-logo.png"
          width={160}
          height={52}
          alt="AgriGet Logo"
          className="h-20 w-auto object-contain"
          style={{ mixBlendMode: "multiply" }}
          priority
        />
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 md:flex">
        <a href="#listings" className="transition hover:text-green-700">Browse Crops</a>
        <a href="#how" className="transition hover:text-green-700">How It Works</a>
        <a href="#join" className="transition hover:text-green-700">For Farmers</a>
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/919877263109"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm font-semibold text-[#1a1f3d] shadow-sm transition hover:bg-green-50 hover:border-green-300 sm:inline-flex"
        >
          <span className="h-2 w-2 rounded-full bg-[#25D366]" />
          WhatsApp
        </a>
        <a
          href="#listings"
          className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          Browse Crops
        </a>
      </div>
    </header>
  );
}
