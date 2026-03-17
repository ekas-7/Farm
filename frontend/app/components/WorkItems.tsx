import Image from "next/image";

type WorkItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
  reverse?: boolean;
};

export default function WorkItems({ items }: { items: WorkItem[] }) {
  return (
    <section className="mt-24">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-600">Who We Serve</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1f3d] md:text-4xl">
          Join AgriGet Platform
        </h2>
        <p className="mt-3 text-gray-500">Built for every participant in the agricultural supply chain</p>
      </div>

      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={item.title}
            className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#c8cdd3] md:flex-row ${
              item.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="relative h-64 shrink-0 overflow-hidden md:h-auto md:w-2/5">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
              <span className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-700">
                {item.title}
              </span>
              <h3 className="text-2xl font-extrabold leading-tight text-[#1a1f3d] md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
