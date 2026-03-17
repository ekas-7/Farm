import Image from "next/image";

export default function Download() {
  return (
    <section className="mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-[#1a1f3d] px-8 py-14 md:px-14 md:py-16">
        {/* Background image overlay */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80&fit=crop"
            fill
            alt="Farm background"
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">Available Soon</p>
            <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
              Order Fresh Produce<br />
              <span className="text-green-400">Directly from Farmers</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-300">
              Farm-to-table, simplified. Connect with local Punjab farmers, track your order, and get the freshest produce delivered to your door or business.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {["No Middlemen", "Best Farm Prices", "WhatsApp Updates"].map((f) => (
                <span key={f} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Product images */}
          <div className="flex shrink-0 items-end gap-4">
            <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&fit=crop"
                fill
                alt="Fresh vegetables"
                className="object-cover"
                sizes="144px"
              />
            </div>
            <div className="relative h-36 w-28 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20">
              <Image
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&fit=crop"
                fill
                alt="Fresh wheat grain"
                className="object-cover"
                sizes="112px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
