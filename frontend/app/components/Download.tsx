import Image from "next/image";
import React from "react";

export default function Download() {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6 px-4 md:px-0">
        <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">Download AgriGet App</h2>
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-12 border-b border-[#c8cdd3] py-12 md:flex-row md:justify-between">
        <div className="max-w-xl text-center md:text-left px-4 md:px-0">
          <h3 className="text-2xl font-semibold text-gray-900">Order Fresh Produce Easily!</h3>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Get fresh, farm-to-table produce delivered to your door with AgriGet. Connect directly with local farmers for the freshest vegetables and bulk orders!
          </p>
          <button className="mt-6 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95 shadow-lg">
            Download App
          </button>
        </div>
        <div className="flex items-center gap-10">
          <Image
            src="/farming/FARMING_8.png"
            alt="Fresh vegetables"
            width={176}
            height={176}
            className="h-40 w-40 object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
          <Image
            src="/farming/FARMING_7.png"
            alt="Farm produce"
            width={200}
            height={240}
            className="h-52 w-40 object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>
    </section>
  );
}
