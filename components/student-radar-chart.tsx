"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

interface StudentProfile {
  comprehension: number
  attention: number
  focus: number
  retention: number
  engagement_time: number
}

interface StudentRadarChartProps {
  studentName: string
  profile: StudentProfile
}

export function StudentRadarChart({ studentName, profile }: StudentRadarChartProps) {
  const radarData = [
    {
      skill: "Comprehension",
      value: profile.comprehension,
      fullMark: 100,
    },
    {
      skill: "Attention",
      value: profile.attention,
      fullMark: 100,
    },
    {
      skill: "Focus",
      value: profile.focus,
      fullMark: 100,
    },
    {
      skill: "Retention",
      value: profile.retention,
      fullMark: 100,
    },
    {
      skill: "Engagement",
      value: profile.engagement_time,
      fullMark: 100,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Student Profile: {studentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis dataKey="skill" className="text-xs" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" tick={{ fontSize: 10 }} tickCount={5} />
            <Radar
              name={studentName}
              dataKey="value"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
