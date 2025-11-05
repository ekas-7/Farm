import Image from "next/image";
import React from "react";

type WorkItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
  cta: string;
  reverse?: boolean;
};

export default function WorkItems({ items }: { items: WorkItem[] }) {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6 px-4 md:px-0">
        <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">Join AgriGet Platform</h2>
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="space-y-12 border-b border-[#c8cdd3] py-12">
        {items.map((item) => (
          <div
            key={item.title}
            className={`flex flex-col items-center gap-10 rounded-3xl bg-white px-8 py-10 shadow-sm md:flex-row md:items-center ${
              item.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full max-w-xs md:max-w-sm">
              <Image
                src={item.image}
                alt={item.alt}
                width={220}
                height={180}
                className="h-full w-full object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className={`flex-1 text-center md:text-left ${item.reverse ? "md:text-right" : ""}`}>
              <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{item.description}</p>
              <button
                className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-green-600 bg-white px-6 py-2 text-sm font-semibold text-green-700 transition-all hover:bg-green-600 hover:text-white active:scale-95"
              >
                {item.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
