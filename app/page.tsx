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
import { Upload, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const handleUploadStart = () => {
    setUploadStatus('uploading')
  }

  const handleUploadSuccess = () => {
    console.log('[Dashboard] Upload successful, refreshing data...')
    setUploadStatus('success')
    
    // Force a complete remount of child components by changing the key
    setRefreshKey(prev => prev + 1)
    
    // Force a hard refresh of the page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 1000)
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
              {uploadStatus === 'idle' && (
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
                      <FileUpload 
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handleUploadSuccess} 
                      />
                    </div>
                  )}
                </div>
              )}
              
              {uploadStatus === 'uploading' && (
                <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
                  <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Uploading and processing data...</span>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Dataset uploaded successfully! Refreshing data...</span>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 border rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="text-sm text-destructive">Error uploading dataset. Please try again.</span>
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
