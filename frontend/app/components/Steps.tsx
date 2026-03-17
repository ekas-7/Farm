import Image from "next/image";

type Step = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <section className="mt-24">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-600">Simple Process</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1f3d] md:text-4xl">
          How AgriGet Works
        </h2>
        <p className="mt-3 text-gray-500">Three simple steps to connect farms with your table</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#c8cdd3] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-green-200"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              {/* Step number */}
              <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-extrabold text-green-700 shadow-lg">
                {index + 1}
              </div>
            </div>

            {/* Text */}
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-[#1a1f3d]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
