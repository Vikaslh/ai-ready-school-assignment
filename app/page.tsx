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
  const [showUpload, setShowUpload] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setShowUpload(false)
    setRefreshKey((prev) => prev + 1)
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">
                    Upload your dataset to begin
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {showUpload ? 'Hide Upload' : 'Upload Dataset'}
                </Button>
              </div>
              
              {showUpload && (
                <div className="pt-4 border-t">
                  <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div key={refreshKey}>
          {/* Overview Cards */}
          <OverviewCards refreshKey={refreshKey} />

          {/* Charts Section */}
          <div className="mt-8">
            <ChartsSection refreshKey={refreshKey} />
          </div>

          {/* Students Table */}
          <div className="mt-8">
            <StudentsTable refreshKey={refreshKey} />
          </div>

          {/* Insights Section */}
          <div className="mt-8">
            <InsightsSection refreshKey={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  )
}
