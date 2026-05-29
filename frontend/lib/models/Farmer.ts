import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFarmer extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Farmer: Model<IFarmer> =
  mongoose.models.Farmer || mongoose.model<IFarmer>("Farmer", FarmerSchema);

export default Farmer;
