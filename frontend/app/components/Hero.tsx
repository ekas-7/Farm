import Image from "next/image";


export default function Hero() {
  return (
    <section className="grid items-center gap-8 pb-16 pt-6 md:grid-cols-2 md:gap-12">
      <div className="flex w-full flex-col items-center text-center px-4 md:items-start md:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
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
        <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            WhatsApp enabled
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Direct delivery
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fresh produce
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-end">
        <Image
          src="/farming/FARMING_7.png"
          width={500}
          height={500}
          alt="Fresh farm produce"
          className="h-auto w-full max-w-md object-contain"
          style={{ mixBlendMode: 'multiply' }}
          priority
        />
      </div>
    </section>
  );
}
