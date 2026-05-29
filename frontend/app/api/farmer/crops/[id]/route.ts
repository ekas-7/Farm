import { NextRequest, NextResponse } from "next/server";
import { verifyToken, FARMER_COOKIE_NAME } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const crop = await Crop.findById(id);
  if (!crop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Farmers can only delete their own crops
  if (crop.farmerId?.toString() !== payload.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await crop.deleteOne();
  return NextResponse.json({ success: true });
}
