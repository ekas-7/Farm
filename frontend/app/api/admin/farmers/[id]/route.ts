import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Farmer from "@/lib/models/Farmer";

function isAdmin(payload: Record<string, unknown> | null) {
  return payload && payload.role === "admin";
}

// PATCH — approve or reject a farmer
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!isAdmin(payload)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { id } = await params;
  await connectDB();

  const farmer = await Farmer.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
  if (!farmer) return NextResponse.json({ error: "Farmer not found" }, { status: 404 });

  return NextResponse.json(farmer);
}

// DELETE — remove a farmer account
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!isAdmin(payload)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  await Farmer.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
