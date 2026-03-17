import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

async function getCrop(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/crops/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crop = await getCrop(id);
  if (!crop) notFound();

  const whatsappMsg = encodeURIComponent(
    `Hi ${crop.farmerName}, I'm interested in buying ${crop.name} from AgriGet. Please share more details.`
  );

  return (
    <div className="min-h-screen bg-[#EDF0ED] text-[#1a1f3d]">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-6">
        {/* Back button */}
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline">
          ← Back to listings
        </Link>

        <div className="rounded-3xl border border-[#c8cdd3] bg-white shadow-sm overflow-hidden">
          {/* Image */}
          <div className="relative h-64 w-full bg-green-50 md:h-80">
            {crop.imageUrl ? (
              <img src={crop.imageUrl} alt={crop.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img src="/farming/FARMING_7.png" alt="Crop" className="h-full w-full object-cover opacity-60" />
              </div>
            )}
            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow">
                {crop.category}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Title & Price */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1a1f3d]">{crop.name}</h1>
                <p className="mt-1 text-gray-500">{crop.location}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-green-600">₹{crop.pricePerKg}<span className="text-lg font-medium text-gray-500">/kg</span></p>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Season: {crop.season}
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Quality: {crop.quality}
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                Available: {crop.availableKg} kg
              </span>
              <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                Min Order: {crop.minOrderKg} kg
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">About This Crop</h2>
              <p className="leading-relaxed text-gray-700">{crop.description}</p>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#EDF0ED] p-4 md:grid-cols-4">
              {[
                { label: "Price per Kg", value: `₹${crop.pricePerKg}` },
                { label: "Min Order", value: `${crop.minOrderKg} kg` },
                { label: "Available Stock", value: `${crop.availableKg} kg` },
                { label: "Total Value", value: `₹${(crop.pricePerKg * crop.availableKg).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-0.5 text-lg font-extrabold text-[#1a1f3d]">{value}</p>
                </div>
              ))}
            </div>

            {/* Farmer Contact */}
            <div className="mt-6 rounded-2xl border border-[#c8cdd3] p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Farmer Contact Details</h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-extrabold text-[#1a1f3d]">{crop.farmerName}</p>
                  <p className="mt-0.5 text-gray-500">{crop.location}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a
                      href={`tel:${crop.farmerPhone}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm font-medium text-[#1a1f3d] shadow-sm transition hover:bg-gray-50"
                    >
                      📞 {crop.farmerPhone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${crop.farmerWhatsApp.replace(/\D/g, "")}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#1ebe5d]"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <a
                    href={`tel:${crop.farmerPhone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-green-700"
                  >
                    Call Farmer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
