import Image from "next/image";
import React from "react";

type Step = {
  title: string;
  description: string;
  image: string;
  alt: string;
  icon?: string;
};

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6 px-4 md:px-0">
        <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">How AgriGet Works</h2>
        <span className="text-2xl font-semibold text-gray-600">⌄</span>
      </div>
      <div className="grid gap-8 border-b border-[#c8cdd3] py-12 text-center md:grid-cols-3 md:gap-12 md:divide-x md:divide-[#c8cdd3]">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center gap-4 px-4 md:px-6">
            <div className="relative">
              <Image
                src={step.image}
                alt={step.alt}
                width={180}
                height={180}
                className="h-36 w-auto object-contain md:h-44"
              />
              {step.icon && (
                <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl shadow-lg">
                  {step.icon}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 md:text-xl">{step.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 md:text-base">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
