import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#c8cdd3] bg-[#EDF0ED]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-8 md:flex-row md:justify-between">
        <Image
          src="/agriget-logo.png"
          width={140}
          height={46}
          alt="AgriGet Logo"
          className="h-10 w-auto object-contain"
          style={{ mixBlendMode: "multiply" }}
        />
        <p className="text-sm text-gray-500">© 2025 AgriGet. Bridging farms and markets.</p>
      </div>
    </footer>
  );
}
