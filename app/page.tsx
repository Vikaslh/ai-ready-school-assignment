"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewCards } from "@/components/overview-cards"
import { ChartsSection } from "@/components/charts-section"
import { StudentsTable } from "@/components/students-table"
import { InsightsSection } from "@/components/insights-section"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Database, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [dataSource, setDataSource] = useState<"sample" | "uploaded">("sample")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setDataSource("uploaded")
    setShowUpload(false)
    setRefreshKey((prev) => prev + 1)
  }

  const resetToSampleData = async () => {
    try {
      const response = await fetch("/api/reset-data", {
        method: "POST",
      })

      if (response.ok) {
        setDataSource("sample")
        setRefreshKey((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Failed to reset data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Source
            </CardTitle>
            <CardDescription>Choose between sample data or upload your own student dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${dataSource === "sample" ? "bg-blue-500" : "bg-gray-300"}`} />
                <span className="text-sm">
                  {dataSource === "sample" ? "Using Sample Data (250 students)" : "Using Uploaded Data"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Dataset
                </Button>
                {dataSource === "uploaded" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToSampleData}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Use Sample Data
                  </Button>
                )}
              </div>
            </div>

            {showUpload && (
              <div className="pt-4 border-t">
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            )}
          </CardContent>
        </Card>

        <div key={refreshKey}>
          {/* Overview Cards */}
          <OverviewCards />

          {/* Charts Section */}
          <div className="mt-8">
            <ChartsSection />
          </div>

          {/* Students Table */}
          <div className="mt-8">
            <StudentsTable />
          </div>

          {/* Insights Section */}
          <div className="mt-8">
            <InsightsSection />
          </div>
        </div>
      </main>
    </div>
  )
}
