import Image from "next/image";
import React from "react";

type Step = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between border-y border-[#c8cdd3] py-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <span className="text-2xl font-semibold">⌄</span>
      </div>
      <div className="grid gap-12 border-b border-[#c8cdd3] py-12 text-center md:grid-cols-3 md:gap-16 md:divide-x md:divide-[#c8cdd3]">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col items-center gap-4 px-6">
            <Image
              src={step.image}
              alt={step.alt}
              width={180}
              height={180}
              className="h-44 w-auto object-contain"
            />
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
