"use client";
import { useState, useMemo } from "react";
import rice from "@/app/data/crops/rice";
import wheat from "@/app/data/crops/wheat";
import potato from "@/app/data/crops/potato";
import {
  type CropIntelligence,
  type Variety,
  type DemandLevel,
  type Trend,
  type ResistanceLevel,
  type SeverityLevel,
  formatRange,
  safe,
} from "@/app/data/cropTypes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, RadialLinearScale,
  PointElement, LineElement, ArcElement, Filler, Tooltip, Legend
);

// ── Colour helpers ────────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Cereal:    "amber",
  Vegetable: "green",
  Oilseed:   "yellow",
  Pulse:     "teal",
  Fruit:     "pink",
};

const DEMAND_BG: Record<DemandLevel, string> = {
  "Very High": "bg-green-700 text-white",
  High:        "bg-green-500 text-white",
  Moderate:    "bg-orange-400 text-white",
  Low:         "bg-red-500 text-white",
};

const TREND_STYLE: Record<Trend, { cls: string; icon: string }> = {
  Increasing: { cls: "text-green-600 bg-green-50 border-green-200", icon: "↑" },
  Stable:     { cls: "text-blue-600 bg-blue-50 border-blue-200", icon: "→" },
  Declining:  { cls: "text-red-500 bg-red-50 border-red-200", icon: "↓" },
};

const RESISTANCE_CLS: Record<ResistanceLevel, string> = {
  Excellent: "bg-green-700 text-white",
  Good:      "bg-blue-500 text-white",
  Moderate:  "bg-orange-400 text-white",
  Poor:      "bg-red-500 text-white",
};

const SEVERITY_CLS: Record<SeverityLevel, string> = {
  High:   "border-red-300 bg-red-50",
  Medium: "border-orange-300 bg-orange-50",
  Low:    "border-yellow-300 bg-yellow-50",
};
const SEVERITY_DOT: Record<SeverityLevel, string> = {
  High: "bg-red-500", Medium: "bg-orange-400", Low: "bg-yellow-400",
};

const ADOPTION_WIDTH: Record<string, string> = {
  "Very High": "w-full", High: "w-3/4", Moderate: "w-1/2", Low: "w-1/4",
};
const ADOPTION_CLR: Record<string, string> = {
  "Very High": "bg-green-600", High: "bg-green-400", Moderate: "bg-yellow-400", Low: "bg-red-400",
};

function Badge({ label, className }: { label: string; className: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{label}</span>;
}

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
      <span className="text-lg">{icon}</span>
      <p className="text-lg font-extrabold text-[#1a1f3d] leading-tight">{value}</p>
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}

// ── Section Wrapper ───────────────────────────────────────────────────────────
function Section({ id, title, accent, children }: { id: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className={`mb-4 flex items-center gap-3`}>
        <div className={`h-5 w-1 rounded-full ${accent}`} />
        <h2 className="text-lg font-extrabold tracking-tight text-[#1a1f3d]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ── Variety Table / Cards ─────────────────────────────────────────────────────
type SortKey = "name" | "duration" | "yield" | "adoption";

function VarietySection({ varieties }: { varieties: Variety[] }) {
  const [sort, setSort] = useState<SortKey>("yield");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [chartView, setChartView] = useState<"bar" | "radar">("bar");

  function toggle(k: SortKey) {
    if (sort === k) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(-1); }
  }

  const ORDER_ADO: Record<string, number> = { "Very High": 4, High: 3, Moderate: 2, Low: 1 };

  const sorted = useMemo(() => [...varieties].sort((a, b) => {
    if (sort === "name") return dir * a.name.localeCompare(b.name);
    if (sort === "duration") {
      const ad = "min" in a.duration ? a.duration.min : (a.duration as { value: number }).value;
      const bd = "min" in b.duration ? b.duration.min : (b.duration as { value: number }).value;
      return dir * (ad - bd);
    }
    if (sort === "yield") {
      const ay = "min" in a.yield ? a.yield.min : (a.yield as { value: number }).value;
      const by = "min" in b.yield ? b.yield.min : (b.yield as { value: number }).value;
      return dir * (ay - by);
    }
    if (sort === "adoption") return dir * ((ORDER_ADO[a.adoption] ?? 0) - (ORDER_ADO[b.adoption] ?? 0));
    return 0;
  }), [varieties, sort, dir]);

  const recVariety = varieties.find((v) => v.recommended) ?? varieties[0];

  // Bar chart — yield comparison
  const yieldData = {
    labels: varieties.map((v) => v.name),
    datasets: [
      {
        label: "Min Yield (q/acre)",
        data: varieties.map((v) => ("min" in v.yield ? v.yield.min : 0)),
        backgroundColor: "rgba(22,163,74,0.5)",
        borderColor: "#16a34a",
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: "Max Yield (q/acre)",
        data: varieties.map((v) => ("max" in v.yield ? v.yield.max : 0)),
        backgroundColor: "rgba(74,222,128,0.4)",
        borderColor: "#4ade80",
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const ORDER_RESIST: Record<ResistanceLevel, number> = { Excellent: 4, Good: 3, Moderate: 2, Poor: 1 };
  const ORDER_ADO2: Record<string, number> = { "Very High": 4, High: 3, Moderate: 2, Low: 1 };

  // Radar chart — multi-dimension variety comparison (top 6 for readability)
  const radarVarieties = varieties.slice(0, 6);
  const RADAR_COLORS = [
    ["rgba(22,163,74,0.25)", "#16a34a"],
    ["rgba(59,130,246,0.25)", "#3b82f6"],
    ["rgba(234,179,8,0.25)", "#ca8a04"],
    ["rgba(239,68,68,0.25)", "#ef4444"],
    ["rgba(168,85,247,0.25)", "#a855f7"],
    ["rgba(249,115,22,0.25)", "#f97316"],
  ];
  const radarData = {
    labels: ["Max Yield", "Min Yield", "Disease Res.", "Adoption", "Speed (inv.)"],
    datasets: radarVarieties.map((v, i) => {
      const maxY = "max" in v.yield ? v.yield.max : ("value" in v.yield ? (v.yield as { value: number }).value : 0);
      const minY = "min" in v.yield ? v.yield.min : ("value" in v.yield ? (v.yield as { value: number }).value : 0);
      const maxDur = "max" in v.duration ? v.duration.max : ("value" in v.duration ? (v.duration as { value: number }).value : 999);
      const [bg, border] = RADAR_COLORS[i % RADAR_COLORS.length];
      return {
        label: v.name,
        data: [
          Math.min(maxY * 2, 100),
          Math.min(minY * 2, 100),
          (ORDER_RESIST[v.diseaseResistance] ?? 1) * 25,
          (ORDER_ADO2[v.adoption] ?? 1) * 25,
          Math.max(0, 100 - maxDur / 2),
        ],
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 2,
        pointBackgroundColor: border,
        pointRadius: 3,
      };
    }),
  };

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-green-700 select-none"
      onClick={() => toggle(k)}
    >
      {label} {sort === k ? (dir === -1 ? "↓" : "↑") : "↕"}
    </th>
  );

  return (
    <div className="space-y-5">
      {/* Recommended banner */}
      {recVariety && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-lg">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Recommended Variety</p>
            <p className="text-lg font-extrabold text-[#1a1f3d]">{recVariety.name}</p>
            <p className="text-sm text-gray-600">{recVariety.features.join(" · ")}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-xl border border-amber-200 bg-white px-3 py-1 font-medium text-amber-700">{formatRange(recVariety.yield)}</span>
            <span className="rounded-xl border border-amber-200 bg-white px-3 py-1 font-medium text-amber-700">{formatRange(recVariety.duration)}</span>
          </div>
        </div>
      )}

      {/* Analytics summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Highest Yield",
            value: formatRange([...varieties].sort((a, b) => {
              const av = "max" in a.yield ? a.yield.max : 0;
              const bv = "max" in b.yield ? b.yield.max : 0;
              return bv - av;
            })[0]?.yield),
            sub: [...varieties].sort((a, b) => {
              const av = "max" in a.yield ? a.yield.max : 0;
              const bv = "max" in b.yield ? b.yield.max : 0;
              return bv - av;
            })[0]?.name ?? "",
          },
          {
            label: "Most Popular",
            value: varieties.find((v) => v.adoption === "Very High")?.name ?? varieties[0]?.name ?? "—",
            sub: "Very High Adoption",
          },
          {
            label: "Shortest Duration",
            value: formatRange([...varieties].sort((a, b) => {
              const ad = "min" in a.duration ? a.duration.min : 999;
              const bd = "min" in b.duration ? b.duration.min : 999;
              return ad - bd;
            })[0]?.duration),
            sub: [...varieties].sort((a, b) => {
              const ad = "min" in a.duration ? a.duration.min : 999;
              const bd = "min" in b.duration ? b.duration.min : 999;
              return ad - bd;
            })[0]?.name ?? "",
          },
          {
            label: "Best Resistance",
            value: varieties.find((v) => v.diseaseResistance === "Excellent")?.name
              ?? varieties.find((v) => v.diseaseResistance === "Good")?.name
              ?? "—",
            sub: varieties.find((v) => v.diseaseResistance === "Excellent") ? "Excellent" : "Good",
          },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{c.label}</p>
            <p className="mt-1 text-base font-extrabold text-[#1a1f3d] leading-tight">{c.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart with toggle */}
      <div className="rounded-2xl border border-[#c8cdd3] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#1a1f3d]">
            {chartView === "bar" ? "Yield Comparison (q/acre)" : "Variety Radar (top 6)"}
          </h3>
          <div className="flex gap-1 rounded-lg border border-[#c8cdd3] p-0.5">
            <button
              onClick={() => setChartView("bar")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                chartView === "bar" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartView("radar")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                chartView === "radar" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Radar
            </button>
          </div>
        </div>
        {chartView === "bar" ? (
          <Bar
            data={yieldData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
              scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 11 } } },
              },
            }}
          />
        ) : (
          <Radar
            data={radarData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  ticks: { stepSize: 25, font: { size: 9 }, backdropColor: "transparent" },
                  pointLabels: { font: { size: 10 } },
                  grid: { color: "#e5e7eb" },
                  angleLines: { color: "#e5e7eb" },
                },
              },
            }}
          />
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[#c8cdd3] bg-white shadow-sm md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-[#c8cdd3] bg-gray-50">
            <tr>
              <Th k="name" label="Variety" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Developed By</th>
              <Th k="duration" label="Duration" />
              <Th k="yield" label="Yield" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Features</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Disease Res.</th>
              <Th k="adoption" label="Adoption" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((v) => (
              <tr key={v.name} className={`transition hover:bg-gray-50 ${v.recommended ? "bg-amber-50/40" : ""}`}>
                <td className="px-4 py-3 font-semibold text-[#1a1f3d]">
                  <div className="flex items-center gap-2">
                    {v.recommended && <span title="Recommended" className="text-amber-400">🏆</span>}
                    {v.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{safe(v.developedBy)}</td>
                <td className="px-4 py-3 text-gray-700">{formatRange(v.duration)}</td>
                <td className="px-4 py-3 font-semibold text-green-700">{formatRange(v.yield)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {v.features.map((f) => (
                      <span key={f} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{f}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge label={v.diseaseResistance} className={RESISTANCE_CLS[v.diseaseResistance]} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-gray-100">
                      <div className={`h-1.5 rounded-full ${ADOPTION_WIDTH[v.adoption]} ${ADOPTION_CLR[v.adoption]}`} />
                    </div>
                    <span className="text-xs text-gray-600">{v.adoption}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {sorted.map((v) => (
          <div key={v.name} className={`rounded-2xl border p-4 shadow-sm ${v.recommended ? "border-amber-200 bg-amber-50/30" : "border-[#c8cdd3] bg-white"}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  {v.recommended && <span className="text-amber-400 text-sm">🏆</span>}
                  <p className="font-bold text-[#1a1f3d]">{v.name}</p>
                </div>
                <p className="text-xs text-gray-400">{safe(v.developedBy)}</p>
              </div>
              <Badge label={v.diseaseResistance} className={RESISTANCE_CLS[v.diseaseResistance]} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-400 text-xs">Yield</span><p className="font-semibold text-green-700">{formatRange(v.yield)}</p></div>
              <div><span className="text-gray-400 text-xs">Duration</span><p className="font-semibold text-[#1a1f3d]">{formatRange(v.duration)}</p></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {v.features.map((f) => (
                <span key={f} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{f}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                <div className={`h-1.5 rounded-full ${ADOPTION_WIDTH[v.adoption]} ${ADOPTION_CLR[v.adoption]}`} />
              </div>
              <span className="text-xs text-gray-500">{v.adoption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quality Section ───────────────────────────────────────────────────────────
const QUALITY_BADGE = ["Moisture", "Protein", "Purity", "Aroma", "Amylose"];

function QualitySection({ params }: { params: { parameter: string; range: Parameters<typeof formatRange>[0]; category: string }[] }) {
  const categoryMap: Record<string, typeof params> = {};
  params.forEach((p) => {
    (categoryMap[p.category] ??= []).push(p);
  });

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#c8cdd3] bg-white shadow-sm md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-[#c8cdd3] bg-gray-50">
            <tr>
              {["Parameter", "Ideal Range", "Category"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {params.map((p) => {
              const isBadge = QUALITY_BADGE.some((b) => p.parameter.toLowerCase().includes(b.toLowerCase()));
              return (
                <tr key={p.parameter} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-[#1a1f3d]">{p.parameter}</td>
                  <td className="px-4 py-3">
                    {isBadge
                      ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">{formatRange(p.range)}</span>
                      : <span className="font-semibold text-green-700">{formatRange(p.range)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{p.category}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards grouped by category */}
      <div className="space-y-3 md:hidden">
        {Object.entries(categoryMap).map(([cat, items]) => (
          <div key={cat} className="rounded-2xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{cat}</p>
            <div className="space-y-3">
              {items.map((p) => {
                const isBadge = QUALITY_BADGE.some((b) => p.parameter.toLowerCase().includes(b.toLowerCase()));
                return (
                  <div key={p.parameter} className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[#1a1f3d]">{p.parameter}</p>
                    {isBadge
                      ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">{formatRange(p.range)}</span>
                      : <span className="text-sm font-semibold text-green-700">{formatRange(p.range)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Disease Section ───────────────────────────────────────────────────────────
function DiseaseSection({ diseases }: { diseases: CropIntelligence["diseases"] }) {
  const [filter, setFilter] = useState<"All" | "Disease" | "Pest">("All");
  const shown = diseases.filter((d) => filter === "All" || d.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["All", "Disease", "Pest"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              filter === f ? "border-green-600 bg-green-600 text-white" : "border-[#c8cdd3] bg-white text-gray-600 hover:border-green-400"
            }`}
          >
            {f} {f !== "All" && `(${diseases.filter((d) => d.type === f).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((d) => (
          <div key={d.name} className={`flex flex-col rounded-2xl border p-5 shadow-sm ${SEVERITY_CLS[d.severity]}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${SEVERITY_DOT[d.severity]}`} />
                  <p className="font-bold text-[#1a1f3d]">{d.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{d.pathogen}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  label={d.type}
                  className={d.type === "Disease" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}
                />
                <Badge
                  label={d.severity}
                  className={d.severity === "High" ? "bg-red-100 text-red-700" : d.severity === "Medium" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm flex-1">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Symptoms</p>
                <p className="text-gray-700 text-xs mt-0.5">{safe(d.symptoms)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Affects</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {d.affectedParts.map((p) => (
                    <span key={p} className="rounded-full bg-white/70 border border-gray-200 px-2 py-0.5 text-xs text-gray-600">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Yield Loss</p>
                <p className="font-semibold text-red-600 text-xs mt-0.5">{formatRange(d.yieldLoss)}</p>
              </div>
            </div>

            <div className="mt-3 border-t border-white/50 pt-3">
              <p className="text-xs font-semibold uppercase text-gray-400 mb-1.5">Control Measures</p>
              <ul className="space-y-1">
                {d.control.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Storage & Market Section ──────────────────────────────────────────────────
function StorageMarketSection({ data }: { data: CropIntelligence["storageAndMarket"] }) {
  const cards = [
    { label: "Storage Life", value: formatRange(data.storageLife), icon: "🏪" },
    { label: "Storage Method", value: safe(data.storageMethod), icon: "📦" },
    { label: "Market Demand", value: safe(data.marketDemand), icon: "📈", badge: data.marketDemand as DemandLevel },
    { label: "Export Potential", value: safe(data.exportPotential), icon: "✈️", badge: data.exportPotential as DemandLevel },
    { label: "MSP Price", value: formatRange(data.mspPrice), icon: "₹" },
    { label: "Annual Production", value: formatRange(data.annualProduction), icon: "🌾" },
    { label: "Global Rank", value: safe(data.globalRank), icon: "🌍" },
    { label: "Optimal Temp", value: formatRange(data.optimalTemperature), icon: "🌡️" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
            <span className="text-xl">{c.icon}</span>
            <p className="mt-2 text-sm font-extrabold text-[#1a1f3d] leading-tight">{c.value}</p>
            {"badge" in c && c.badge && (
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${DEMAND_BG[c.badge]}`}>{c.badge}</span>
            )}
            <p className="mt-1 text-xs text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#c8cdd3] bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-[#1a1f3d]">Processing Industries</h3>
          <div className="flex flex-wrap gap-2">
            {(data.processingIndustries ?? []).map((i) => (
              <span key={i} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{i}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#c8cdd3] bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-[#1a1f3d]">Major Export Markets</h3>
          <div className="flex flex-wrap gap-2">
            {(data.exportCountries ?? []).map((c) => (
              <span key={c} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SubType content (basic info + variety + quality) ──────────────────────────
function SubTypeContent({ sub, accentBar }: { sub: CropIntelligence["subTypes"][0]; accentBar: string }) {
  const bi = sub.basicInfo;
  const trendStyle = TREND_STYLE[bi.cultivationTrend as Trend] ?? TREND_STYLE.Stable;

  const infoRows = [
    ["Season", safe(bi.season)],
    ["Soil Type", safe(bi.soilType)],
    ["pH Range", formatRange(bi.pH)],
    ["Temperature", formatRange(bi.temperature)],
    ["Sowing Depth", formatRange(bi.sowingDepth)],
    ["Maturity Period", formatRange(bi.maturityDays)],
    ["Fertilizers", safe(bi.fertilizers)],
    ["Irrigations", safe(bi.irrigations)],
    ["Major States", (bi.majorStates ?? []).join(", ") || "Data Not Available"],
  ];

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Yield / Acre" value={formatRange(bi.yieldPerAcre)} icon="🌾" />
        <MetricCard label="Water Required" value={formatRange(bi.waterRequirement)} icon="💧" />
        <div className="flex flex-col gap-1 rounded-xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
          <span className="text-lg">📊</span>
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEMAND_BG[bi.marketDemand as DemandLevel] ?? "bg-gray-200 text-gray-700"}`}>
            {safe(bi.marketDemand)}
          </span>
          <p className="text-xs font-medium text-gray-500">Market Demand</p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
          <span className="text-lg">✈️</span>
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEMAND_BG[bi.exportPotential as DemandLevel] ?? "bg-gray-200 text-gray-700"}`}>
            {safe(bi.exportPotential)}
          </span>
          <p className="text-xs font-medium text-gray-500">Export Potential</p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-[#c8cdd3] bg-white p-4 shadow-sm">
          <span className="text-lg">📈</span>
          <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${trendStyle.cls}`}>
            {trendStyle.icon} {safe(bi.cultivationTrend)}
          </span>
          <p className="text-xs font-medium text-gray-500">Cultivation Trend</p>
        </div>
      </div>

      {/* Info table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#c8cdd3] bg-white shadow-sm md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-[#c8cdd3] bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Parameter</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {infoRows.map(([k, v]) => (
              <tr key={k} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-600 w-1/3">{k}</td>
                <td className="px-4 py-3 text-[#1a1f3d]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {infoRows.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[#c8cdd3] bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{k}</p>
            <p className="mt-0.5 text-sm text-[#1a1f3d]">{v}</p>
          </div>
        ))}
      </div>

      {/* Variety Analysis */}
      <Section id={`variety-${sub.id}`} title="Variety Analysis" accent={accentBar}>
        {sub.varieties.length > 0
          ? <VarietySection varieties={sub.varieties} />
          : <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Variety data not available</div>}
      </Section>

      {/* Quality Standards */}
      <Section id={`quality-${sub.id}`} title="Quality Standards" accent={accentBar}>
        {sub.qualityParameters.length > 0
          ? <QualitySection params={sub.qualityParameters} />
          : <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Quality data not available</div>}
      </Section>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
const ALL_CROPS: CropIntelligence[] = [rice, wheat, potato];

const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "diseases", label: "Diseases & Pests" },
  { id: "storage", label: "Storage & Market" },
];

export default function IntelligencePage() {
  const [activeCrop, setActiveCrop] = useState<CropIntelligence>(rice);
  const [activeSubType, setActiveSubType] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const catColor = CATEGORY_COLOR[activeCrop.cropCategory] ?? "gray";
  const accentBar = `bg-${catColor}-500`;

  const sub = activeCrop.subTypes[activeSubType];
  const hasSubTypes = activeCrop.subTypes.length > 1;

  // Filter varieties for search
  const searchLower = search.toLowerCase();
  const filteredVarieties = sub?.varieties.filter(
    (v) =>
      !search ||
      v.name.toLowerCase().includes(searchLower) ||
      v.features.some((f) => f.toLowerCase().includes(searchLower))
  ) ?? [];

  return (
    <div className="min-h-screen bg-[#EDF0ED] text-[#1a1f3d]">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-[#c8cdd3] bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/agriget-logo.png" alt="AgriGet" className="h-14 w-auto" style={{ mixBlendMode: "multiply" }} />
          </Link>
          <div className="mx-2 h-5 w-px bg-gray-200 shrink-0" />
          <p className="text-sm font-bold text-green-700 shrink-0 hidden sm:block">Crop Intelligence</p>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search varieties…"
              className="w-full rounded-full border border-[#c8cdd3] bg-[#EDF0ED] py-1.5 pl-9 pr-4 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Mobile sidebar toggle */}
          <button
            className="ml-auto lg:hidden rounded-lg border border-[#c8cdd3] bg-white p-2"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle navigation"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* ── Sidebar ── */}
        <aside
          className={`${
            sidebarOpen ? "fixed inset-0 z-40 flex flex-col" : "hidden"
          } lg:relative lg:flex lg:flex-col lg:z-auto lg:inset-auto w-64 shrink-0`}
        >
          {/* Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className="relative z-10 flex flex-col gap-4 rounded-2xl border border-[#c8cdd3] bg-white p-4 shadow-sm lg:sticky lg:top-24 h-fit">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Crops</p>
              {ALL_CROPS.map((c) => (
                <button
                  key={c.cropId}
                  onClick={() => { setActiveCrop(c); setActiveSubType(0); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    activeCrop.cropId === c.cropId
                      ? `bg-${CATEGORY_COLOR[c.cropCategory] ?? "gray"}-50 text-${CATEGORY_COLOR[c.cropCategory] ?? "gray"}-700 border border-${CATEGORY_COLOR[c.cropCategory] ?? "gray"}-200`
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full bg-${CATEGORY_COLOR[c.cropCategory] ?? "gray"}-400`} />
                  {c.cropName}
                  <span className="ml-auto text-xs text-gray-400 font-normal">{c.cropCategory}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#c8cdd3] pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sections</p>
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                  className={`flex w-full rounded-xl px-3 py-2 text-sm font-medium transition ${
                    activeSection === s.id ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1 space-y-8">

          {/* Crop Hero */}
          <div className={`rounded-2xl border border-${catColor}-200 bg-gradient-to-br from-${catColor}-50 to-white p-6 shadow-sm`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1f3d]">{activeCrop.cropName}</h1>
                <p className="mt-1 text-sm italic text-gray-500">{activeCrop.scientificName}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge label={activeCrop.cropCategory} className={`bg-${catColor}-100 text-${catColor}-800 border border-${catColor}-200`} />
                  {sub && <Badge label={sub.basicInfo.season} className="bg-blue-100 text-blue-700 border border-blue-200" />}
                  {activeCrop.storageAndMarket && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TREND_STYLE[activeCrop.subTypes[0]?.basicInfo.cultivationTrend as Trend]?.cls ?? ""}`}>
                      {TREND_STYLE[activeCrop.subTypes[0]?.basicInfo.cultivationTrend as Trend]?.icon}{" "}
                      {activeCrop.subTypes[0]?.basicInfo.cultivationTrend}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p className="font-semibold text-[#1a1f3d]">{activeCrop.subTypes.length} Sub-type{activeCrop.subTypes.length > 1 ? "s" : ""}</p>
                <p>{activeCrop.diseases.length} Diseases / Pests</p>
                <p>{activeCrop.subTypes.reduce((s, st) => s + st.varieties.length, 0)} Varieties</p>
              </div>
            </div>
          </div>

          {/* Sub-type tabs (Rice) */}
          {hasSubTypes && (
            <div className="flex gap-1 rounded-xl border border-[#c8cdd3] bg-white p-1 shadow-sm w-fit">
              {activeCrop.subTypes.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setActiveSubType(i)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                    activeSubType === i
                      ? `bg-${catColor}-600 text-white shadow-sm`
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={activeSubType === i ? { backgroundColor: catColor === "amber" ? "#d97706" : undefined } : {}}
                >
                  {st.name}
                </button>
              ))}
            </div>
          )}

          {/* Overview section */}
          {sub && (
            <Section id="overview" title={`${sub.name} — Overview`} accent={accentBar}>
              <SubTypeContent
                sub={search ? { ...sub, varieties: filteredVarieties } : sub}
                accentBar={accentBar}
              />
            </Section>
          )}

          {/* Diseases section */}
          <Section id="diseases" title="Diseases & Pest Analysis" accent={accentBar}>
            {activeCrop.diseases.length > 0
              ? <DiseaseSection diseases={activeCrop.diseases} />
              : <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Disease data not available</div>}
          </Section>

          {/* Storage & Market */}
          <Section id="storage" title="Storage & Market Analysis" accent={accentBar}>
            {activeCrop.storageAndMarket
              ? <StorageMarketSection data={activeCrop.storageAndMarket} />
              : <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Market data not available</div>}
          </Section>

        </main>
      </div>
    </div>
  );
}
