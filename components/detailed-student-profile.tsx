"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, 
  BarChart2, 
  Brain, 
  CheckCircle, 
  Clock, 
  Info, 
  LayoutGrid, 
  Lightbulb, 
  TrendingUp, 
  User, 
  Users, 
  X,
  Target,
  AlertTriangle,
  BookOpen,
  Calendar
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
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

interface DetailedStudentProfileProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

const clusterNames = {
  0: "Balanced Learners",
  1: "High Performers",
  2: "Attention Seekers",
  3: "Developing Learners",
}

const clusterColors = {
  0: "bg-blue-100 text-blue-800 border-blue-200",
  1: "bg-green-100 text-green-800 border-green-200",
  2: "bg-yellow-100 text-yellow-800 border-yellow-200",
  3: "bg-red-100 text-red-800 border-red-200",
}

const clusterDescriptions = {
  0: "Shows consistent performance across all cognitive areas with balanced strengths.",
  1: "Demonstrates exceptional performance with high scores in most cognitive areas.",
  2: "May benefit from attention and focus improvement strategies to reach full potential.",
  3: "Shows potential for growth with targeted support in key learning areas.",
}

const getRecommendations = (student: Student) => {
  const recommendations = []

  if (student.attention < 60) {
    recommendations.push({
      type: "attention",
      title: "Improve Attention Skills",
      description: "Consider shorter learning sessions with frequent breaks",
      priority: "high",
    })
  }

  if (student.focus < 60) {
    recommendations.push({
      type: "focus",
      title: "Enhance Focus Techniques",
      description: "Implement mindfulness exercises and distraction-free environments",
      priority: "high",
    })
  }

  if (student.comprehension < 70) {
    recommendations.push({
      type: "comprehension",
      title: "Strengthen Comprehension",
      description: "Use visual aids and interactive learning materials",
      priority: "medium",
    })
  }

  if (student.retention < 70) {
    recommendations.push({
      type: "retention",
      title: "Improve Memory Retention",
      description: "Practice spaced repetition and active recall techniques",
      priority: "medium",
    })
  }

  if (student.engagement_time < 45) {
    recommendations.push({
      type: "engagement",
      title: "Increase Engagement",
      description: "Incorporate gamification and interactive elements",
      priority: "medium",
    })
  }

  return recommendations
}

interface Strength {
  skill: string;
  level: string;
  value: number;
}

const getStrengths = (student: Student): Strength[] => {
  const strengths: Strength[] = [];
  const skills = [
    { name: "Comprehension", value: student.comprehension },
    { name: "Attention", value: student.attention },
    { name: "Focus", value: student.focus },
    { name: "Retention", value: student.retention },
    { name: "Engagement", value: student.engagement_time },
  ]

  skills.forEach((skill) => {
    if (skill.value >= 80) {
      strengths.push({ skill: skill.name, level: "Excellent", value: skill.value })
    } else if (skill.value >= 70) {
      strengths.push({ skill: skill.name, level: "Good", value: skill.value })
    }
  })

  return strengths
}

export function DetailedStudentProfile({ student, isOpen, onClose }: DetailedStudentProfileProps) {
  if (!student) return null

  const radarData = [
    { skill: "Comprehension", value: student.comprehension, fullMark: 100 },
    { skill: "Attention", value: student.attention, fullMark: 100 },
    { skill: "Focus", value: student.focus, fullMark: 100 },
    { skill: "Retention", value: student.retention, fullMark: 100 },
    { skill: "Engagement", value: student.engagement_time, fullMark: 100 },
  ]

  const skillsData = [
    { name: "Comprehension", value: student.comprehension, color: "#8884d8" },
    { name: "Attention", value: student.attention, color: "#82ca9d" },
    { name: "Focus", value: student.focus, color: "#ffc658" },
    { name: "Retention", value: student.retention, color: "#ff7300" },
    { name: "Engagement", value: student.engagement_time, color: "#00ff88" },
  ]

  const progressData = [
    { month: "Sep", score: student.assessment_score - 15 + Math.random() * 10 },
    { month: "Oct", score: student.assessment_score - 10 + Math.random() * 8 },
    { month: "Nov", score: student.assessment_score - 5 + Math.random() * 6 },
    { month: "Dec", score: student.assessment_score + Math.random() * 4 },
  ]

  const recommendations = getRecommendations(student)
  const strengths = getStrengths(student)
  const overallGrade =
    student.assessment_score >= 90
      ? "A+"
      : student.assessment_score >= 85
        ? "A"
        : student.assessment_score >= 80
          ? "B+"
          : student.assessment_score >= 75
            ? "B"
            : student.assessment_score >= 70
              ? "C+"
              : student.assessment_score >= 65
                ? "C"
                : "D"

  if (!isOpen || !student) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-lg shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                <p className="text-muted-foreground">Student ID: {student.student_id} • Class: {student.class}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{overallGrade}</div>
                    <div className="text-sm text-muted-foreground">Overall Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{student.assessment_score.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Assessment Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{student.engagement_time.toFixed(0)}<span className="text-lg font-normal text-muted-foreground">m</span></div>
                    <div className="text-sm text-muted-foreground">Avg. Engagement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1">
                      <Badge className={`text-xs ${clusterColors[student.cluster as keyof typeof clusterColors]}`}>
                        {clusterNames[student.cluster as keyof typeof clusterNames]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Learning Persona</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 p-1 bg-muted/20 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center justify-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <LayoutGrid className="h-4 w-4" />
                <span className="whitespace-nowrap">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center justify-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart2 className="h-4 w-4" />
                <span className="whitespace-nowrap">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center justify-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <TrendingUp className="h-4 w-4" />
                <span className="whitespace-nowrap">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center justify-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Lightbulb className="h-4 w-4" />
                <span className="whitespace-nowrap">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center justify-center gap-2 py-2 px-3 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Info className="h-4 w-4" />
                <span className="whitespace-nowrap">Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Cognitive Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" className="text-xs" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                        <Radar
                          name={student.name}
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {strengths.length > 0 ? (
                      strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{strength.skill}</span>
                          </div>
                          <Badge variant="secondary">{strength.level}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Focus on building foundational skills</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Persona Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        {clusterNames[student.cluster as keyof typeof clusterNames]}
                      </h4>
                      <p className="text-muted-foreground">
                        {clusterDescriptions[student.cluster as keyof typeof clusterDescriptions]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={skillsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Skills Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillsData.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm font-semibold">{skill.value.toFixed(1)}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {skill.value >= 80
                            ? "Excellent"
                            : skill.value >= 70
                              ? "Good"
                              : skill.value >= 60
                                ? "Average"
                                : "Needs Improvement"}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <Card
                      key={index}
                      className={`border-l-4 ${rec.priority === "high" ? "border-l-red-500" : "border-l-yellow-500"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              rec.priority === "high" ? "bg-red-100" : "bg-yellow-100"
                            }`}
                          >
                            {rec.priority === "high" ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : (
                              <Target className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                            <Badge
                              variant="outline"
                              className={`mt-2 ${
                                rec.priority === "high"
                                  ? "border-red-200 text-red-700"
                                  : "border-yellow-200 text-yellow-700"
                              }`}
                            >
                              {rec.priority === "high" ? "High Priority" : "Medium Priority"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-lg mb-2">Excellent Performance!</h3>
                      <p className="text-muted-foreground">
                        This student is performing well across all areas. Continue with current learning strategies.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-mono">{student.student_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span>{student.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Learning Cluster:</span>
                      <Badge className={clusterColors[student.cluster as keyof typeof clusterColors]}>
                        Cluster {student.cluster}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assessment Score:</span>
                      <span className="font-semibold">{student.assessment_score.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comprehension:</span>
                      <span>{student.comprehension.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attention Span:</span>
                      <span>{student.attention.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Focus Level:</span>
                      <span>{student.focus.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retention Rate:</span>
                      <span>{student.retention.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement Time:</span>
                      <span>{student.engagement_time.toFixed(1)} minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
