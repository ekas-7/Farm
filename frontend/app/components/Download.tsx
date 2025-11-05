import Image from "next/image";
import React from "react";

export default function Download() {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6">
        <h2 className="text-2xl font-semibold">Download our app</h2>
        <span className="text-2xl font-semibold">⌄</span>
      </div>
      <div className="flex flex-col items-center gap-12 border-b border-[#c8cdd3] py-12 md:flex-row md:justify-between">
        <div className="max-w-xl text-center md:text-left">
          <h3 className="text-2xl font-semibold">Order easily!</h3>
          <p className="mt-4 text-base leading-relaxed text-[#4b5563]">
            Get the most delicious bites delivered to your door with QuickBite. Our fastest delivery
            service carries a variety of cuisines from local restaurants!
          </p>
          <button className="mt-6 rounded-full bg-[#1a1f3d] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a2f4d]">
            Download
          </button>
        </div>
        <div className="flex items-center gap-10">
          <Image
            src="/hero2.png"
            alt="Pizza illustration"
            width={176}
            height={176}
            className="h-40 w-40 object-contain"
          />
          <Image
            src="/hero1.png"
            alt="Phone illustration"
            width={200}
            height={240}
            className="h-52 w-40 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
