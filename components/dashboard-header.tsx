import { GraduationCap, Users, TrendingUp } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Student Cognitive Skills & Performance Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive analytics for educational insights and student development
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>250 Students</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>6 Classes</span>
          </div>
        </div>
      </div>
    </header>
  )
}
