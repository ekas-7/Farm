import { NextRequest, NextResponse } from "next/server";
import { verifyToken, FARMER_COOKIE_NAME } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

// GET — farmer's own crops
export async function GET(req: NextRequest) {
  const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const crops = await Crop.find({ farmerId: String(payload.id) }).sort({ createdAt: -1 });
  return NextResponse.json(crops);
}

// POST — farmer creates a crop
export async function POST(req: NextRequest) {
  const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const crop = await Crop.create({
      ...body,
      farmerId: String(payload.id),
    });

    return NextResponse.json(crop, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create crop" }, { status: 500 });
  }
}
