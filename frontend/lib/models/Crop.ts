import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICrop extends Document {
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
  createdAt: Date;
}

const CropSchema = new Schema<ICrop>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    minOrderKg: { type: Number, required: true },
    availableKg: { type: Number, required: true },
    location: { type: String, required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    farmerWhatsApp: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    season: { type: String, required: true },
    quality: { type: String, required: true },
  },
  { timestamps: true }
);

const Crop: Model<ICrop> =
  mongoose.models.Crop || mongoose.model<ICrop>("Crop", CropSchema);

export default Crop;
