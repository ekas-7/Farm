"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

interface Crop {
  _id: string;
  name: string;
  category: string;
  pricePerKg: number;
  availableKg: number;
  location: string;
  imageUrl: string;
  season: string;
  quality: string;
  farmerPhone: string;
  farmerWhatsApp: string;
  createdAt: string;
}

interface Farmer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
}

const EMPTY_FORM = {
  name: "", category: "", description: "", pricePerKg: "", minOrderKg: "",
  availableKg: "", location: "", farmerName: "", farmerPhone: "", farmerWhatsApp: "",
  imageUrl: "", season: "", quality: "",
};

const CHART_COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

export default function FarmerDashboard() {
  const router = useRouter();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "listings" | "add">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "date">("date");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/farmer/me")
      .then((r) => {
        if (r.status === 401) { router.push("/farmer/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setFarmer(data);
        setForm((f) => ({ ...f, farmerName: data.name, farmerPhone: data.phone, farmerWhatsApp: data.phone, location: data.location }));
      });
  }, [router]);

  useEffect(() => { fetchCrops(); }, []);

  async function fetchCrops() {
    const res = await fetch("/api/farmer/crops");
    if (res.ok) {
      const data = await res.json();
      setCrops(Array.isArray(data) ? data : []);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(): Promise<string> {
    if (!imageFile) return form.imageUrl;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const imageUrl = await uploadImage();
      const res = await fetch("/api/farmer/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, imageUrl,
          pricePerKg: Number(form.pricePerKg),
          minOrderKg: Number(form.minOrderKg),
          availableKg: Number(form.availableKg),
        }),
      });
      if (res.ok) {
        setMessage("Crop listed successfully!");
        setForm((f) => ({ ...EMPTY_FORM, farmerName: f.farmerName, farmerPhone: f.farmerPhone, farmerWhatsApp: f.farmerWhatsApp, location: f.location }));
        setImageFile(null);
        setImagePreview("");
        if (fileRef.current) fileRef.current.value = "";
        fetchCrops();
        setTab("listings");
      } else {
        const d = await res.json();
        setMessage(d.error ?? "Failed to add crop.");
      }
    } catch {
      setMessage("Error adding crop.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/farmer/crops/${id}`, { method: "DELETE" });
    fetchCrops();
  }

  async function handleLogout() {
    await fetch("/api/farmer/login", { method: "DELETE" });
    router.push("/farmer/login");
    router.refresh();
  }

  // --- Derived analytics data ---
  const totalStock = crops.reduce((s, c) => s + c.availableKg, 0);
  const totalValue = crops.reduce((s, c) => s + c.pricePerKg * c.availableKg, 0);
  const avgPrice = crops.length ? crops.reduce((s, c) => s + c.pricePerKg, 0) / crops.length : 0;

  // Category breakdown for doughnut
  const categoryMap: Record<string, number> = {};
  crops.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryLabels = Object.keys(categoryMap);
  const categoryValues = Object.values(categoryMap);

  // Price per crop bar chart
  const sortedByPrice = [...crops].sort((a, b) => b.pricePerKg - a.pricePerKg).slice(0, 8);

  // Stock per crop bar chart
  const sortedByStock = [...crops].sort((a, b) => b.availableKg - a.availableKg).slice(0, 8);

  // Listings over time (line chart) — group by month
  const monthlyMap: Record<string, number> = {};
  crops.forEach((c) => {
    const month = new Date(c.createdAt).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const monthlyLabels = Object.keys(monthlyMap);
  const monthlyValues = Object.values(monthlyMap);

  // Season breakdown
  const seasonMap: Record<string, number> = {};
  crops.forEach((c) => {
    seasonMap[c.season] = (seasonMap[c.season] || 0) + 1;
  });

  // Filtered + sorted listings
  const filteredCrops = crops
    .filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return b.pricePerKg - a.pricePerKg;
      if (sortBy === "stock") return b.availableKg - a.availableKg;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (!farmer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EDF0ED]">
        <div className="flex gap-2 items-center">
          {[0, 150, 300].map((d) => (
            <span key={d} className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF0ED] text-[#1a1f3d]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src="/agriget-logo.png" width={120} height={40} alt="AgriGet" className="h-12 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
            </Link>
            <div className="border-l border-[#c8cdd3] pl-3">
              <p className="text-sm font-extrabold text-[#1a1f3d]">{farmer.name}</p>
              <p className="text-xs text-gray-500">{farmer.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${farmer.status === "approved" ? "bg-green-100 text-green-700" : farmer.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
              {farmer.status}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[#c8cdd3]">
          {([
            { key: "dashboard", label: "Dashboard" },
            { key: "listings", label: `My Listings (${crops.length})` },
            { key: "add", label: "+ Add Crop" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMessage(""); }}
              className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="space-y-6">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total Listings", value: crops.length, unit: "crops", color: "bg-green-600" },
                { label: "Total Stock", value: totalStock.toLocaleString("en-IN"), unit: "kg", color: "bg-emerald-500" },
                { label: "Portfolio Value", value: `₹${(totalValue / 1000).toFixed(1)}k`, unit: "est.", color: "bg-teal-500" },
                { label: "Avg Price", value: `₹${avgPrice.toFixed(0)}`, unit: "per kg", color: "bg-green-800" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                  <div className={`mb-3 h-1.5 w-10 rounded-full ${s.color}`} />
                  <p className="text-2xl font-extrabold text-[#1a1f3d]">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.unit}</p>
                  <p className="mt-2 text-sm font-medium text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>

            {crops.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-16 text-center text-gray-400">
                <p className="text-lg font-medium">No crops yet — add your first listing to see analytics.</p>
                <button
                  onClick={() => setTab("add")}
                  className="mt-4 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                >
                  Add Your First Crop
                </button>
              </div>
            ) : (
              <>
                {/* Row 1: Bar charts */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Price per Crop (₹/kg)</h3>
                    <Bar
                      data={{
                        labels: sortedByPrice.map((c) => c.name),
                        datasets: [{
                          label: "Price (₹/kg)",
                          data: sortedByPrice.map((c) => c.pricePerKg),
                          backgroundColor: CHART_COLORS,
                          borderRadius: 6,
                          borderSkipped: false,
                        }],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                          y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  </div>

                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Stock Available (kg)</h3>
                    <Bar
                      data={{
                        labels: sortedByStock.map((c) => c.name),
                        datasets: [{
                          label: "Stock (kg)",
                          data: sortedByStock.map((c) => c.availableKg),
                          backgroundColor: "#bbf7d0",
                          borderColor: "#16a34a",
                          borderWidth: 1.5,
                          borderRadius: 6,
                          borderSkipped: false,
                        }],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                          y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Doughnut + Line */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Crops by Category</h3>
                    <div className="flex items-center gap-6">
                      <div className="w-44 shrink-0">
                        <Doughnut
                          data={{
                            labels: categoryLabels,
                            datasets: [{
                              data: categoryValues,
                              backgroundColor: CHART_COLORS,
                              borderWidth: 2,
                              borderColor: "#fff",
                            }],
                          }}
                          options={{
                            responsive: true,
                            cutout: "65%",
                            plugins: {
                              legend: { display: false },
                              tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} crop${ctx.parsed !== 1 ? "s" : ""}` } },
                            },
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        {categoryLabels.map((cat, i) => (
                          <div key={cat} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                              <span className="text-gray-700 truncate max-w-[100px]">{cat}</span>
                            </div>
                            <span className="font-semibold text-[#1a1f3d]">{categoryValues[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Listings Over Time</h3>
                    {monthlyLabels.length < 2 ? (
                      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                        Add more listings across different months to see the trend.
                      </div>
                    ) : (
                      <Line
                        data={{
                          labels: monthlyLabels,
                          datasets: [{
                            label: "New Listings",
                            data: monthlyValues,
                            borderColor: "#16a34a",
                            backgroundColor: "rgba(22,163,74,0.08)",
                            borderWidth: 2,
                            pointBackgroundColor: "#16a34a",
                            pointRadius: 4,
                            tension: 0.4,
                            fill: true,
                          }],
                        }}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                            y: { grid: { color: "#f0f0f0" }, ticks: { stepSize: 1, font: { size: 11 } } },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Row 3: Season breakdown + top crops table */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Season Breakdown</h3>
                    <Bar
                      data={{
                        labels: Object.keys(seasonMap),
                        datasets: [{
                          label: "Crops",
                          data: Object.values(seasonMap),
                          backgroundColor: ["#16a34a", "#22c55e", "#4ade80", "#86efac"],
                          borderRadius: 8,
                          borderSkipped: false,
                        }],
                      }}
                      options={{
                        indexAxis: "y" as const,
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { color: "#f0f0f0" }, ticks: { stepSize: 1, font: { size: 11 } } },
                          y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        },
                      }}
                    />
                  </div>

                  <div className="rounded-2xl bg-white border border-[#c8cdd3] p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-[#1a1f3d]">Top Crops by Value</h3>
                    <div className="space-y-2">
                      {[...crops]
                        .sort((a, b) => b.pricePerKg * b.availableKg - a.pricePerKg * a.availableKg)
                        .slice(0, 5)
                        .map((c, i) => {
                          const val = c.pricePerKg * c.availableKg;
                          const maxVal = crops.reduce((m, x) => Math.max(m, x.pricePerKg * x.availableKg), 0);
                          return (
                            <div key={c._id}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                                  <span className="font-medium text-[#1a1f3d] truncate max-w-[120px]">{c.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-green-700">₹{(val / 1000).toFixed(1)}k</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-gray-100">
                                <div
                                  className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                                  style={{ width: `${maxVal > 0 ? (val / maxVal) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === "listings" && (
          <div>
            {/* Search + Sort */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search by name, category, location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none shadow-sm"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none shadow-sm"
              >
                <option value="date">Sort: Newest</option>
                <option value="price">Sort: Price ↓</option>
                <option value="stock">Sort: Stock ↓</option>
                <option value="name">Sort: Name A-Z</option>
              </select>
            </div>

            {filteredCrops.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-12 text-center text-gray-400">
                <p className="text-lg font-medium">{crops.length === 0 ? "No crops listed yet." : "No results match your search."}</p>
                {crops.length === 0 && (
                  <button
                    onClick={() => setTab("add")}
                    className="mt-4 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                  >
                    Add Your First Crop
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCrops.map((crop) => (
                  <div key={crop._id} className="flex items-start gap-3 rounded-2xl border border-[#c8cdd3] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-green-50">
                      <img
                        src={crop.imageUrl || "/farming/FARMING_7.png"}
                        alt={crop.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/farming/FARMING_7.png"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#1a1f3d]">{crop.name}</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{crop.category}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{crop.season}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">{crop.location} · <strong className="text-green-700">₹{crop.pricePerKg}/kg</strong> · {crop.availableKg.toLocaleString("en-IN")} kg available</p>
                      <p className="text-xs text-gray-400">{crop.quality} · Listed {new Date(crop.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(crop._id)}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD CROP TAB ── */}
        {tab === "add" && (
          <div className="rounded-2xl border border-[#c8cdd3] bg-white p-6 shadow-sm max-w-xl">
            <h2 className="mb-5 text-lg font-bold text-[#1a1f3d]">Add New Crop Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Crop Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c8cdd3] bg-[#EDF0ED] transition hover:border-green-400 hover:bg-green-50"
                  style={{ minHeight: imagePreview ? "auto" : "100px" }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 w-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-5 text-gray-400">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Click to upload crop image</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                </div>
              </div>

              {[
                { label: "Crop Name", key: "name", placeholder: "e.g. Wheat" },
                { label: "Category", key: "category", placeholder: "e.g. Grain, Vegetable, Fruit" },
                { label: "Season", key: "season", placeholder: "e.g. Rabi, Kharif" },
                { label: "Quality Grade", key: "quality", placeholder: "e.g. Grade A, Premium" },
                { label: "Location", key: "location", placeholder: "e.g. Ludhiana, Punjab" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                  <input
                    className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</label>
                <textarea
                  className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe quality, growing method, etc."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Price/Kg (₹)", key: "pricePerKg", placeholder: "25" },
                  { label: "Min Order (Kg)", key: "minOrderKg", placeholder: "50" },
                  { label: "Available (Kg)", key: "availableKg", placeholder: "500" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-[#c8cdd3] pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Your Contact Details</p>
                {[
                  { label: "Your Name", key: "farmerName", placeholder: "Full name" },
                  { label: "Phone", key: "farmerPhone", placeholder: "+91 98765 43210" },
                  { label: "WhatsApp", key: "farmerWhatsApp", placeholder: "+91 98765 43210" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="mb-3">
                    <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                    <input
                      className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required
                    />
                  </div>
                ))}
              </div>

              {message && (
                <p className={`rounded-lg px-3 py-2 text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full rounded-full bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {uploading ? "Uploading image..." : loading ? "Submitting..." : "List This Crop"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
