import { NextResponse } from "next/server"
import { getUploadedDataset, hasUploadedData, generateMockStudents } from "@/lib/data-storage"

export async function GET() {
  try {
    console.log("[v0] Students API called")

    if (hasUploadedData()) {
      const uploadedDataset = getUploadedDataset()!
      console.log("[v0] Using uploaded dataset with", uploadedDataset.recordCount, "students")

      return NextResponse.json({
        success: true,
        data: uploadedDataset.students,
        total: uploadedDataset.recordCount,
        source: "uploaded",
        uploadedAt: uploadedDataset.uploadedAt,
        filename: uploadedDataset.filename,
      })
    } else {
      console.log("[v0] No uploaded data found, generating mock student data")
      const students = generateMockStudents()
      console.log("[v0] Generated", students.length, "mock students")

      return NextResponse.json({
        success: true,
        data: students,
        total: students.length,
        source: "mock",
      })
    }
  } catch (error) {
    console.error("[v0] Students API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch students data" }, { status: 500 })
  }
}
