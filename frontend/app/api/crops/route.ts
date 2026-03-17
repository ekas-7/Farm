import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

export async function GET() {
  try {
    await connectDB();
    const crops = await Crop.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(crops);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch crops" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const crop = await Crop.create(body);
    return NextResponse.json(crop, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create crop" }, { status: 500 });
  }
}
