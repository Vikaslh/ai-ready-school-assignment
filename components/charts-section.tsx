"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

interface Student {
  student_id: string
  name: string
  class: string
  comprehension: number
  attention: number
  focus: number
  retention: number
  assessment_score: number
  engagement_time: number
  cluster: number
}

interface AnalyticsData {
  correlations: Record<string, number>
}

interface ChartsSectionProps {
  refreshKey?: number
}

export function ChartsSection({ refreshKey = 0 }: ChartsSectionProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('[ChartsSection] Fetching data...')
        const [studentsResponse, analyticsResponse] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/analytics"),
        ])
        
        const [studentsData, analyticsData] = await Promise.all([
          studentsResponse.json(),
          analyticsResponse.json()
        ])
        
        console.log('[ChartsSection] Students data:', studentsData)
        console.log('[ChartsSection] Analytics data:', analyticsData)
        
        if (studentsData.success) {
          console.log('[ChartsSection] Setting students data...', studentsData.data.length, 'students')
          setStudents(studentsData.data)
        } else {
          console.error('[ChartsSection] Error fetching students:', studentsData.error)
          setStudents([])
        }
        
        if (analyticsData.success) {
          console.log('[ChartsSection] Setting analytics data...', analyticsData.data ? 'data exists' : 'no data')
          setAnalytics(analyticsData.data || { correlations: {} })
        } else {
          console.error('[ChartsSection] Error fetching analytics:', analyticsData.error)
          setAnalytics({ correlations: {} })
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        console.log('[ChartsSection] Fetching data complete, setting loading state to false...')
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="h-[400px] animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="h-[calc(100%-3.5rem)]">
              <div className="h-full w-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!Array.isArray(students) || students.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No student data available. Please upload a dataset to view charts.</p>
          <p className="text-xs text-muted-foreground mt-2">
            {analytics ? 'Analytics data is available but no student records found.' : 'No analytics data available.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for skills vs assessment score chart
  const skillsData = analytics?.correlations 
    ? Object.entries(analytics.correlations).map(([skill, correlation]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1).replace("_", " "),
        correlation: Math.abs(Number(correlation)) || 0,
        value: Number(correlation) || 0,
      }))
    : []

  // Prepare scatter plot data (attention vs assessment score)
  const scatterData = Array.isArray(students) && students.length > 0
    ? students.map((student) => ({
        attention: Number(student.attention) || 0,
        assessment_score: Number(student.assessment_score) || 0,
        name: student.name || 'Unknown',
      }))
    : []
  
  console.log('[ChartsSection] Skills data:', skillsData)
  console.log('[ChartsSection] Scatter data:', scatterData)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skills Correlation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Cognitive Skills Correlation with Assessment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="skill"
                className="text-xs"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number) => [value.toFixed(3), "Correlation"]}
              />
              <Bar dataKey="correlation" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attention vs Assessment Score Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Attention vs Assessment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="attention"
                name="Attention"
                domain={["dataMin - 5", "dataMax + 5"]}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="assessment_score"
                name="Assessment Score"
                domain={["dataMin - 5", "dataMax + 5"]}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number, name: string) => [
                  value.toFixed(1),
                  name === "attention" ? "Attention" : "Assessment Score",
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `Student: ${payload[0].payload.name}`
                  }
                  return ""
                }}
              />
              <Scatter data={scatterData} fill="hsl(var(--chart-2))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
