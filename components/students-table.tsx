"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, Eye, Download, Filter } from "lucide-react"
import { DetailedStudentProfile } from "./detailed-student-profile"

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

const clusterNames = {
  0: "Balanced Learners",
  1: "High Performers",
  2: "Attention Seekers",
  3: "Developing Learners",
}

const clusterColors = {
  0: "bg-blue-100 text-blue-800",
  1: "bg-green-100 text-green-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-red-100 text-red-800",
}

export function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [clusterFilter, setClusterFilter] = useState("all")
  const [sortField, setSortField] = useState<keyof Student>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailedProfile, setShowDetailedProfile] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAllColumns, setShowAllColumns] = useState(false)
  const studentsPerPage = 10

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/students")
        const result = await response.json()
        if (result.success) {
          setStudents(result.data)
          setFilteredStudents(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = classFilter === "all" || student.class === classFilter
      const matchesCluster = clusterFilter === "all" || student.cluster.toString() === clusterFilter
      return matchesSearch && matchesClass && matchesCluster
    })

    // Sort students
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [students, searchTerm, classFilter, clusterFilter, sortField, sortDirection])

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailedProfile(true)
  }

  const exportToCSV = () => {
    const headers = [
      "Student ID",
      "Name",
      "Class",
      "Comprehension",
      "Attention",
      "Focus",
      "Retention",
      "Assessment Score",
      "Engagement Time",
      "Learning Persona",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          student.student_id,
          `"${student.name}"`,
          `"${student.class}"`,
          student.comprehension,
          student.attention,
          student.focus,
          student.retention,
          student.assessment_score,
          student.engagement_time,
          `"${clusterNames[student.cluster as keyof typeof clusterNames]}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students_data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const uniqueClasses = Array.from(new Set(students.map((s) => s.class))).sort()
  // Filter out null/undefined clusters and ensure they're numbers
  const uniqueClusters = Array.from(new Set(
    students
      .map((s) => s.cluster)
      .filter((cluster): cluster is number => cluster !== null && cluster !== undefined)
  )).sort((a, b) => a - b)

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)
  const startIndex = (currentPage - 1) * studentsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage)

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading student data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (students.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground mb-4">No student data available.</p>
          <p className="text-sm text-muted-foreground">Please upload a CSV file to view student records.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Students Directory
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllColumns(!showAllColumns)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showAllColumns ? "Hide Columns" : "Show All Columns"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={clusterFilter} onValueChange={setClusterFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                {uniqueClusters.map((cluster) => {
                  const clusterKey = cluster.toString();
                  return (
                    <SelectItem key={clusterKey} value={clusterKey}>
                      {clusterNames[cluster as keyof typeof clusterNames] || `Persona ${cluster}`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {paginatedStudents.length} of {filteredStudents.length} students
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("student_id")}
                      className="h-auto p-0 font-semibold"
                    >
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("class")}
                      className="h-auto p-0 font-semibold"
                    >
                      Class
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  {showAllColumns && (
                    <>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("comprehension")}
                          className="h-auto p-0 font-semibold"
                        >
                          Comprehension
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("attention")}
                          className="h-auto p-0 font-semibold"
                        >
                          Attention
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("focus")}
                          className="h-auto p-0 font-semibold"
                        >
                          Focus
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("retention")}
                          className="h-auto p-0 font-semibold"
                        >
                          Retention
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("engagement_time")}
                          className="h-auto p-0 font-semibold"
                        >
                          Engagement
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </>
                  )}
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("assessment_score")}
                      className="h-auto p-0 font-semibold"
                    >
                      Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Learning Persona</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    {showAllColumns && (
                      <>
                        <TableCell>
                          <span className="font-semibold">{student.comprehension.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{student.attention.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{student.focus.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{student.retention.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{student.engagement_time.toFixed(1)}m</span>
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <span className="font-semibold">{student.assessment_score.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={clusterColors[student.cluster as keyof typeof clusterColors]}>
                        {clusterNames[student.cluster as keyof typeof clusterNames]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(student)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailedStudentProfile
        student={selectedStudent}
        isOpen={showDetailedProfile}
        onClose={() => {
          setShowDetailedProfile(false)
          setSelectedStudent(null)
        }}
      />
    </div>
  )
}
