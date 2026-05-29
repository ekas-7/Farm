import { NextRequest, NextResponse } from "next/server";
import { verifyToken, FARMER_COOKIE_NAME } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Farmer from "@/lib/models/Farmer";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const farmer = await Farmer.findById(payload.id).select("-password");
  if (!farmer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(farmer);
}
