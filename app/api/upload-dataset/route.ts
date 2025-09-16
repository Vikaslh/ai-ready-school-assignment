import { type NextRequest, NextResponse } from "next/server"
import { setUploadedDataset } from "@/lib/data-storage"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json({ success: false, error: "Only CSV files are allowed" }, { status: 400 })
    }

    // Read and validate CSV content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const csvContent = buffer.toString("utf-8")

    // Basic CSV validation
    const lines = csvContent.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: "CSV file must contain at least a header and one data row" },
        { status: 400 },
      )
    }

    const header = lines[0].toLowerCase()
    const requiredColumns = [
      "student_id",
      "name",
      "class",
      "comprehension",
      "attention",
      "focus",
      "retention",
      "assessment_score",
      "engagement_time",
    ]

    const missingColumns = requiredColumns.filter((col) => !header.includes(col))
    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required columns: ${missingColumns.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Parse and validate data
    const students = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      if (values.length >= requiredColumns.length) {
        const student = {
          student_id: values[0],
          name: values[1],
          class: values[2],
          comprehension: Number.parseFloat(values[3]) || 0,
          attention: Number.parseFloat(values[4]) || 0,
          focus: Number.parseFloat(values[5]) || 0,
          retention: Number.parseFloat(values[6]) || 0,
          assessment_score: Number.parseFloat(values[7]) || 0,
          engagement_time: Number.parseFloat(values[8]) || 0,
        }
        students.push(student)
      }
    }

    if (students.length === 0) {
      return NextResponse.json({ success: false, error: "No valid student records found in CSV" }, { status: 400 })
    }

    setUploadedDataset({
      students,
      uploadedAt: new Date().toISOString(),
      filename: file.name,
      recordCount: students.length,
    })

    console.log("[v0] Successfully processed and stored", students.length, "student records")

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${students.length} student records`,
      recordCount: students.length,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process uploaded file",
      },
      { status: 500 },
    )
  }
}
