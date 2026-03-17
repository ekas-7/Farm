import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grid items-center gap-10 pb-20 pt-8 md:grid-cols-2 md:gap-16">
      {/* Left */}
      <div className="flex w-full flex-col items-start text-left">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Direct from Farm · Punjab, India
        </div>

        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1a1f3d] md:text-5xl lg:text-[3.75rem]">
          Fresh Crops,<br />
          <span className="text-green-600">Direct from Farmers</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg">
          AgriGet connects Punjab&apos;s farmers with businesses and consumers. Buy in bulk for your MSME or order retail — no middlemen, always fresh.
        </p>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-6">
          {[
            { value: "500+", label: "Farmers" },
            { value: "12K+", label: "Orders Fulfilled" },
            { value: "98%", label: "Fresh Guarantee" },
          ].map(({ value, label }) => (
            <div key={label} className="text-left">
              <p className="text-2xl font-extrabold text-[#1a1f3d]">{value}</p>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {[
            "WhatsApp Enabled",
            "Direct Delivery",
            "Farm Fresh",
          ].map((badge) => (
            <span key={badge} className="rounded-full border border-[#c8cdd3] bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Right — hero image */}
      <div className="relative flex items-center justify-center">
        <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80&fit=crop"
            fill
            alt="Farmer in a lush green field in Punjab"
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Floating card */}
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <div className="h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&q=80&fit=crop"
                width={40}
                height={40}
                alt="Fresh wheat"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1f3d]">Wheat — Grade A</p>
              <p className="text-xs text-gray-500">₹28/kg · Ludhiana, Punjab</p>
            </div>
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">LIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
