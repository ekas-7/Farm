"use client";
import { useEffect, useState } from "react";
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

export default function CropListings() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crops")
      .then((r) => r.json())
      .then((data) => {
        setCrops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  if (crops.length === 0) {
    return (
      <section className="mt-20">
        <h2 className="mb-4 text-2xl font-extrabold text-[#1a1f3d]">Fresh Crop Listings</h2>
        <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-12 text-center text-gray-400">
          <p className="text-lg font-medium">No crops listed yet.</p>
          <p className="mt-1 text-sm">Check back soon — farmers are adding products daily.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-[#1a1f3d]">
          Fresh Crop Listings
          <span className="ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-base font-semibold text-green-700">
            {crops.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {crops.map((crop) => (
          <Link href={`/crops/${crop._id}`} key={crop._id} className="group block">
            <div className="h-full overflow-hidden rounded-2xl border border-[#c8cdd3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-green-700 shadow">
                    {crop.category}
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
                  <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">
                    {crop.season}
                  </span>
                  <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">
                    {crop.quality}
                  </span>
                  <span className="rounded-full bg-[#EDF0ED] px-2 py-0.5 text-xs text-gray-600">
                    {crop.availableKg} kg
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#c8cdd3] pt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{crop.farmerName}</p>
                    <p className="text-xs text-gray-400">Min order: {crop.minOrderKg} kg</p>
                  </div>
                  <span className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-green-700">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
