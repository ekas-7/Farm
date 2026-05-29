"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
  createdAt: string;
}

interface Farmer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const EMPTY_FORM = {
  name: "", category: "", description: "", pricePerKg: "", minOrderKg: "",
  availableKg: "", location: "", farmerName: "", farmerPhone: "", farmerWhatsApp: "",
  imageUrl: "", season: "", quality: "",
};

const STATUS_STYLES = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"crops" | "farmers">("crops");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchCrops() {
    const res = await fetch("/api/crops");
    const data = await res.json();
    setCrops(Array.isArray(data) ? data : []);
  }

  async function fetchFarmers() {
    const res = await fetch("/api/admin/farmers");
    if (res.ok) {
      const data = await res.json();
      setFarmers(Array.isArray(data) ? data : []);
    }
  }

  useEffect(() => {
    fetchCrops();
    fetchFarmers();
  }, []);

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
      const res = await fetch("/api/crops", {
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
        setMessage("Crop added successfully!");
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview("");
        if (fileRef.current) fileRef.current.value = "";
        fetchCrops();
        setShowForm(false);
      } else {
        setMessage("Failed to add crop.");
      }
    } catch {
      setMessage("Error adding crop.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCrop(id: string) {
    if (!confirm("Delete this crop?")) return;
    await fetch(`/api/crops/${id}`, { method: "DELETE" });
    fetchCrops();
  }

  async function updateFarmerStatus(id: string, status: "approved" | "rejected" | "pending") {
    const res = await fetch(`/api/admin/farmers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchFarmers();
  }

  async function deleteFarmer(id: string) {
    if (!confirm("Remove this farmer account?")) return;
    await fetch(`/api/admin/farmers/${id}`, { method: "DELETE" });
    fetchFarmers();
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const pendingCount = farmers.filter((f) => f.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#EDF0ED] text-[#1a1f3d]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white text-xl font-bold">A</div>
            <div>
              <h1 className="text-2xl font-extrabold text-green-700">Admin Panel</h1>
              <p className="text-sm text-gray-500">AgriGet — Platform Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-[#c8cdd3] bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[#c8cdd3]">
          <button
            onClick={() => setTab("crops")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${tab === "crops" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            All Crops ({crops.length})
          </button>
          <button
            onClick={() => setTab("farmers")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${tab === "farmers" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Farmer Accounts ({farmers.length})
            {pendingCount > 0 && (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* CROPS TAB */}
        {tab === "crops" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Listings */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1a1f3d]">
                  All Listings <span className="text-green-600">({crops.length})</span>
                </h2>
                <button
                  onClick={() => setShowForm((s) => !s)}
                  className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 transition"
                >
                  {showForm ? "Cancel" : "+ Add Crop"}
                </button>
              </div>
              {crops.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-10 text-center text-gray-400">
                  No crops listed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {crops.map((crop) => (
                    <div key={crop._id} className="flex items-start gap-3 rounded-2xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-green-50">
                        <img
                          src={crop.imageUrl || "/farming/FARMING_7.png"}
                          alt={crop.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/farming/FARMING_7.png"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1a1f3d] truncate">{crop.name}</span>
                          <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{crop.category}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 truncate">{crop.location} · ₹{crop.pricePerKg}/kg · {crop.availableKg}kg</p>
                        <p className="text-xs text-gray-400 truncate">{crop.farmerName} · {crop.farmerPhone}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCrop(crop._id)}
                        className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Crop Form */}
            {showForm && (
              <div className="rounded-2xl border border-[#c8cdd3] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-[#1a1f3d]">Add Crop (Admin)</h2>
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
                          <span className="text-sm">Click to upload</span>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                    </div>
                  </div>

                  {[
                    { label: "Crop Name", key: "name", placeholder: "e.g. Wheat" },
                    { label: "Category", key: "category", placeholder: "e.g. Grain" },
                    { label: "Season", key: "season", placeholder: "e.g. Rabi" },
                    { label: "Quality", key: "quality", placeholder: "e.g. Grade A" },
                    { label: "Location", key: "location", placeholder: "e.g. Ludhiana" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                      <input className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none" placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                    </div>
                  ))}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</label>
                    <textarea className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "₹/Kg", key: "pricePerKg" },
                      { label: "Min Kg", key: "minOrderKg" },
                      { label: "Avail Kg", key: "availableKg" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                        <input type="number" className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required min="0" />
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#c8cdd3] pt-3 space-y-3">
                    {[
                      { label: "Farmer Name", key: "farmerName" },
                      { label: "Phone", key: "farmerPhone" },
                      { label: "WhatsApp", key: "farmerWhatsApp" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                        <input className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2 text-sm focus:border-green-500 focus:outline-none" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                      </div>
                    ))}
                  </div>

                  {message && (
                    <p className={`rounded-lg px-3 py-2 text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{message}</p>
                  )}

                  <button type="submit" disabled={loading || uploading} className="w-full rounded-full bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                    {uploading ? "Uploading..." : loading ? "Adding..." : "Add Crop Listing"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* FARMERS TAB */}
        {tab === "farmers" && (
          <div>
            {farmers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c8cdd3] bg-white p-12 text-center text-gray-400">
                No farmer registrations yet.
              </div>
            ) : (
              <div className="space-y-3">
                {farmers.map((farmer) => (
                  <div key={farmer._id} className="rounded-2xl border border-[#c8cdd3] bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#1a1f3d] text-lg">{farmer.name}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[farmer.status]}`}>
                            {farmer.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{farmer.email} · {farmer.phone}</p>
                        <p className="text-xs text-gray-400">{farmer.location} · Registered {new Date(farmer.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {farmer.status !== "approved" && (
                          <button
                            onClick={() => updateFarmerStatus(farmer._id, "approved")}
                            className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                        )}
                        {farmer.status !== "rejected" && (
                          <button
                            onClick={() => updateFarmerStatus(farmer._id, "rejected")}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            Reject
                          </button>
                        )}
                        {farmer.status === "rejected" && (
                          <button
                            onClick={() => updateFarmerStatus(farmer._id, "pending")}
                            className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          onClick={() => deleteFarmer(farmer._id)}
                          className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
