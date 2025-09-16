"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Award, Brain } from "lucide-react"

interface ClusterData {
  name: string
  count: number
  averageScore: number
  characteristics: {
    comprehension: number
    attention: number
    focus: number
    retention: number
    engagement_time: number
  }
}

interface AnalyticsData {
  modelPerformance: {
    accuracy: number
    r2Score: number
  }
  clusters: Record<string, ClusterData>
  keyFindings: string[]
  featureImportance: Array<{
    feature: string
    importance: number
  }>
}

export function InsightsSection() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics")
        const result = await response.json()
        if (result.success) {
          setAnalytics(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch insights data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) return null

  const topFeature = analytics.featureImportance[0]
  const clusterArray = Object.entries(analytics.clusters).map(([id, data]) => ({
    id,
    ...data,
  }))

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Key Insights & Findings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-chart-1" />
              <div>
                <p className="text-sm font-medium">Model Accuracy</p>
                <p className="text-2xl font-bold text-chart-1">
                  {(analytics.modelPerformance.accuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Award className="h-8 w-8 text-chart-2" />
              <div>
                <p className="text-sm font-medium">Top Predictor</p>
                <p className="text-lg font-bold text-chart-2 capitalize">{topFeature.feature.replace("_", " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-8 w-8 text-chart-3" />
              <div>
                <p className="text-sm font-medium">Learning Personas</p>
                <p className="text-2xl font-bold text-chart-3">{Object.keys(analytics.clusters).length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Research Findings:</h4>
            <ul className="space-y-2">
              {analytics.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Learning Personas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            Learning Personas (Clusters)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusterArray.map((cluster) => (
              <div key={cluster.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{cluster.name}</h4>
                  <Badge variant="secondary">{cluster.count} students</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Score: <span className="font-medium text-foreground">{cluster.averageScore.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Comprehension: {cluster.characteristics.comprehension.toFixed(1)}</div>
                  <div>Attention: {cluster.characteristics.attention.toFixed(1)}</div>
                  <div>Focus: {cluster.characteristics.focus.toFixed(1)}</div>
                  <div>Retention: {cluster.characteristics.retention.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
