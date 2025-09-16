"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onUploadSuccess: () => void
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Reset state
    setFile(selectedFile)
    setUploadStatus("idle")
    setErrorMessage("")

    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please select a CSV file")
      setUploadStatus("error")
      return
    }

    // Quick file size check (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File size should be less than 5MB")
      setUploadStatus("error")
      return
    }

    // Optional: Preview first few lines for format validation
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const lines = content.split("\n").filter(Boolean)
        
        if (lines.length < 2) {
          setErrorMessage("CSV file must contain at least a header and one data row")
          setUploadStatus("error")
          return
        }

        // Validate header
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
          "engagement_time"
        ]

        const missingColumns = requiredColumns.filter(col => !header.includes(col))
        if (missingColumns.length > 0) {
          setErrorMessage(`Missing required columns: ${missingColumns.join(", ")}`)
          setUploadStatus("error")
          return
        }
      } catch (error) {
        console.error("Error previewing file:", error)
        setErrorMessage("Error reading file. Please check the format and try again.")
        setUploadStatus("error")
      }
    }
    reader.onerror = () => {
      setErrorMessage("Error reading file. Please try again.")
      setUploadStatus("error")
    }
    reader.readAsText(selectedFile.slice(0, 5000)) // Only read first 5KB for header check
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-dataset", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      if (result.success) {
        setUploadStatus("success")
        // Show success message for a few seconds before calling onUploadSuccess
        setTimeout(() => {
          onUploadSuccess()
        }, 1500)
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "An error occurred while processing your file. Please try again."
      )
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Dataset
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="csv-file">CSV File</Label>
            <a 
              href="/sample-student-data.csv" 
              download 
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Download Sample CSV
            </a>
          </div>
          <div className="relative">
            <Input 
              id="csv-file" 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              disabled={uploading}
              className="cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : "Choose a CSV file..."}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Expected columns: student_id, name, class, comprehension, attention, focus, retention, assessment_score, engagement_time
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              ×
            </Button>
          </div>
        )}

        {uploadStatus === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Dataset uploaded successfully! The dashboard will now use your data.</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
            {uploading ? "Uploading..." : "Upload Dataset"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
