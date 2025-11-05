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
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6">
        <h2 className="text-2xl font-semibold">Work with QuickBite</h2>
        <span className="text-2xl font-semibold">⌄</span>
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
              />
            </div>
            <div className={`flex-1 text-center md:text-left ${item.reverse ? "md:text-right" : ""}`}>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-[#4b5563]">{item.description}</p>
              <button
                className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-[#1a1f3d] px-6 py-2 text-sm font-semibold text-[#1a1f3d] transition-colors hover:bg-[#1a1f3d] hover:text-white"
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
