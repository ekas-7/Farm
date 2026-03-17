import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const crop = await Crop.findById(id).lean();
    if (!crop) return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    return NextResponse.json(crop);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch crop" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Crop.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete crop" }, { status: 500 });
  }
}
