import Image from "next/image";


export default function Hero() {
  return (
    <section className="grid items-center gap-8 pb-16 pt-6 md:grid-cols-[160px,1fr,160px] md:gap-12">
      <div className="mx-auto h-32 w-32 md:h-40 md:w-40">
        <Image
          src="/hero1.png"
          width={160}
          height={160}
          alt="Fresh farm produce"
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center px-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          <span className="text-lg">🌾</span>
          Direct from Farm to Your Business
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          Connect Farmers with Businesses & Consumers
        </h1>
        <p className="mt-4 text-base text-gray-600 md:text-lg max-w-xl">
          AgriGet bridges the gap between farmers and markets. Get fresh produce in bulk for your business or buy retail for your home.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl active:scale-95">
            For Businesses (B2B)
          </button>
          <button className="rounded-full border-2 border-green-600 bg-white px-8 py-3 text-base font-semibold text-green-700 shadow-lg transition-all hover:bg-green-50 hover:shadow-xl active:scale-95">
            For Customers (B2C)
          </button>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <span>💬 WhatsApp enabled</span>
          <span>•</span>
          <span>🚚 Direct delivery</span>
          <span>•</span>
          <span>✅ Fresh produce</span>
        </div>
      </div>

      <div className="mx-auto h-32 w-32 md:h-40 md:w-40">
        <Image
          src="/hero2.png"
          width={160}
          height={160}
          alt="Farm vegetables"
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
