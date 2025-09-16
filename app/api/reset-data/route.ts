import { NextResponse } from "next/server"
import { clearUploadedDataset } from "@/lib/data-storage"

export async function POST() {
  try {
    console.log("[v0] Reset data API called")
    clearUploadedDataset()

    return NextResponse.json({
      success: true,
      message: "Data reset to sample data successfully",
    })
  } catch (error) {
    console.error("[v0] Reset data error:", error)
    return NextResponse.json({ success: false, error: "Failed to reset data" }, { status: 500 })
  }
}
