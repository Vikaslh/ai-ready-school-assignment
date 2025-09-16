"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Eye, Target, BookOpen, Clock, Trophy } from "lucide-react"

interface OverviewData {
  averageComprehension: number
  averageAttention: number
  averageFocus: number
  averageRetention: number
  averageEngagementTime: number
  averageAssessmentScore: number
}

export function OverviewCards() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics")
        const result = await response.json()
        if (result.success) {
          setData(result.data.overview)
        }
      } catch (error) {
        console.error("Failed to fetch overview data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const cards = [
    {
      title: "Comprehension",
      value: data.averageComprehension,
      icon: Brain,
      color: "text-chart-1",
    },
    {
      title: "Attention",
      value: data.averageAttention,
      icon: Eye,
      color: "text-chart-2",
    },
    {
      title: "Focus",
      value: data.averageFocus,
      icon: Target,
      color: "text-chart-3",
    },
    {
      title: "Retention",
      value: data.averageRetention,
      icon: BookOpen,
      color: "text-chart-4",
    },
    {
      title: "Engagement Time",
      value: data.averageEngagementTime,
      icon: Clock,
      color: "text-chart-5",
      suffix: "min",
    },
    {
      title: "Assessment Score",
      value: data.averageAssessmentScore,
      icon: Trophy,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value.toFixed(1)}
                {card.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{card.suffix}</span>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
