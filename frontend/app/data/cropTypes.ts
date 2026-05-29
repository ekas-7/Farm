export type RangeValue =
  | { min: number; max: number; unit: string }
  | { operator: "<" | ">" | "≤" | "≥"; value: number; unit: string };

export function formatRange(r: RangeValue | undefined | null): string {
  if (!r) return "Data Not Available";
  if ("operator" in r) {
    const sym = r.operator === "<" ? "Below" : r.operator === ">" ? "Above" : r.operator === "≤" ? "Up to" : "At least";
    return `${sym} ${r.value}${r.unit}`;
  }
  return `${r.min}–${r.max} ${r.unit}`.trim();
}

export function safe(val: unknown, fallback = "Data Not Available"): string {
  if (val === null || val === undefined || val === "" || (typeof val === "number" && isNaN(val))) return fallback;
  return String(val);
}

export type DemandLevel = "Very High" | "High" | "Moderate" | "Low";
export type Trend = "Increasing" | "Stable" | "Declining";
export type ResistanceLevel = "Excellent" | "Good" | "Moderate" | "Poor";
export type SeverityLevel = "High" | "Medium" | "Low";
export type CropCategory = "Cereal" | "Vegetable" | "Oilseed" | "Pulse" | "Fruit";

export interface BasicInfo {
  season: string;
  yieldPerAcre: RangeValue;
  waterRequirement: RangeValue;
  marketDemand: DemandLevel;
  exportPotential: DemandLevel;
  cultivationTrend: Trend;
  soilType: string;
  pH: RangeValue;
  temperature: RangeValue;
  sowingDepth: RangeValue;
  maturityDays: RangeValue;
  majorStates: string[];
  fertilizers: string;
  irrigations: string;
}

export interface Variety {
  name: string;
  developedBy: string;
  duration: RangeValue;
  yield: RangeValue;
  features: string[];
  diseaseResistance: ResistanceLevel;
  adoption: "Very High" | "High" | "Moderate" | "Low";
  recommended: boolean;
}

export interface QualityParameter {
  parameter: string;
  range: RangeValue;
  category: string;
}

export interface SubType {
  id: string;
  name: string;
  basicInfo: BasicInfo;
  varieties: Variety[];
  qualityParameters: QualityParameter[];
}

export interface Disease {
  name: string;
  type: "Disease" | "Pest";
  pathogen: string;
  severity: SeverityLevel;
  affectedParts: string[];
  symptoms: string;
  yieldLoss: RangeValue;
  favorableConditions: string;
  control: string[];
}

export interface StorageAndMarket {
  storageLife: RangeValue;
  storageMethod: string;
  optimalTemperature: RangeValue;
  optimalHumidity: RangeValue;
  marketDemand: DemandLevel;
  exportPotential: DemandLevel;
  majorMarkets: string[];
  mspPrice: RangeValue;
  processingIndustries: string[];
  exportCountries: string[];
  annualProduction: RangeValue;
  globalRank: string;
}

export interface CropIntelligence {
  cropId: string;
  cropName: string;
  scientificName: string;
  cropCategory: CropCategory;
  subTypes: SubType[];
  diseases: Disease[];
  storageAndMarket: StorageAndMarket;
}
