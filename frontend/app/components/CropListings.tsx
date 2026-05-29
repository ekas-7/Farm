"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Crop {
  _id: string;
  name: string;
  category: string;
  description: string;
  pricePerKg: number;
  minOrderKg: number;
  availableKg: number;
  location: string;
  farmerName: string;
  farmerPhone: string;
  farmerWhatsApp: string;
  imageUrl: string;
  season: string;
  quality: string;
}

function CropCard({ crop, index }: { crop: Crop; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <Link href={`/crops/${crop._id}`} className="group block h-full">
        <div className="h-full overflow-hidden rounded-2xl border border-[#c8cdd3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-green-200">
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-green-50">
            <img
              src={crop.imageUrl || "/farming/FARMING_7.png"}
              alt={crop.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/farming/FARMING_7.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-green-700 shadow">
                {crop.category}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-green-700 shadow-lg backdrop-blur-sm">
                View Details →
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-extrabold text-[#1a1f3d] group-hover:text-green-700 transition-colors">
                {crop.name}
              </h3>
              <span className="shrink-0 text-base font-extrabold text-green-600">
                ₹{crop.pricePerKg}<span className="text-xs font-normal text-gray-400">/kg</span>
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">{crop.location}</p>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{crop.description}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">{crop.season}</span>
              <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">{crop.quality}</span>
              <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">{crop.availableKg} kg</span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#c8cdd3] pt-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">{crop.farmerName}</p>
                <p className="text-xs text-gray-400">Min order: {crop.minOrderKg} kg</p>
              </div>
              <span className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-green-700 group-hover:shadow-md">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CropListings() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");

  useEffect(() => {
    fetch("/api/crops")
      .then((r) => r.json())
      .then((data) => {
        setCrops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(crops.map((c) => c.category))).sort()];

  const filtered = crops
    .filter((c) => {
      const matchCat = activeCategory === "All" || c.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.farmerName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerKg - b.pricePerKg;
      if (sortBy === "price_desc") return b.pricePerKg - a.pricePerKg;
      return 0;
    });

  if (loading) {
    return (
      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-extrabold text-[#1a1f3d]">Fresh Crop Listings</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[#c8cdd3] bg-white p-5">
              <div className="mb-3 h-40 rounded-xl bg-gray-200" />
              <div className="mb-2 h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-[#1a1f3d]">
          Fresh Crop Listings
          <span className="ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-base font-semibold text-green-700">
            {filtered.length}
          </span>
        </h2>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-xl border border-[#c8cdd3] bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-green-400 cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search crops, location, farmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#c8cdd3] bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-green-600 text-white shadow-sm scale-105"
                  : "bg-white border border-[#c8cdd3] text-gray-600 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-12 text-center text-gray-400">
          <p className="text-lg font-medium">No crops found.</p>
          <p className="mt-1 text-sm">Try a different search or category.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-4 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crop, i) => (
            <CropCard key={crop._id} crop={crop} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
