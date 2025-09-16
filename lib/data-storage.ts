interface StudentData {
  student_id: string
  name: string
  class: string
  comprehension: number
  attention: number
  focus: number
  retention: number
  assessment_score: number
  engagement_time: number
  cluster?: number
}

interface UploadedDataset {
  students: StudentData[]
  uploadedAt: string
  filename: string
  recordCount: number
}

const STORAGE_KEY = 'studentDashboardDataset';

// In-memory storage with localStorage persistence
let uploadedDataset: UploadedDataset | null = (() => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
})();

export function setUploadedDataset(data: UploadedDataset) {
  uploadedDataset = data;
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("[v0] Dataset stored in localStorage:", data.recordCount, "records");
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

export function getUploadedDataset(): UploadedDataset | null {
  return uploadedDataset;
}

export function hasUploadedData(): boolean {
  return !!uploadedDataset?.students?.length;
}

export function clearUploadedDataset() {
  uploadedDataset = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
  console.log("[v0] Uploaded dataset cleared");
}

// Generate mock data as fallback
export function generateMockStudents(): StudentData[] {
  // Check if we have saved data first
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.students?.length) {
          return parsed.students;
        }
      }
    } catch (error) {
      console.error('Error loading mock data from localStorage:', error);
    }
  }
  const classes = ["Grade 9A", "Grade 9B", "Grade 10A", "Grade 10B", "Grade 11A", "Grade 11B"]
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Quinn",
    "Sage",
    "River",
    "Skylar",
    "Phoenix",
    "Rowan",
    "Emery",
    "Finley",
    "Hayden",
    "Jamie",
    "Kendall",
    "Logan",
    "Parker",
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ]

  const allStudents: StudentData[] = []

  for (let i = 1; i <= 250; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const className = classes[Math.floor(Math.random() * classes.length)]

    // Generate correlated cognitive skills
    const comprehension = Math.max(20, Math.min(100, 75 + (Math.random() - 0.5) * 30))
    const attention = Math.max(15, Math.min(100, 70 + (Math.random() - 0.5) * 36))
    const focus = Math.max(20, Math.min(100, 72 + (Math.random() - 0.5) * 32))
    const retention = Math.max(15, Math.min(100, 68 + (Math.random() - 0.5) * 34))
    const engagement_time = Math.max(10, Math.min(120, attention * 0.3 + focus * 0.4 + (Math.random() - 0.5) * 20))

    // Assessment score influenced by cognitive skills
    const assessment_score = Math.max(
      30,
      Math.min(
        100,
        comprehension * 0.35 +
          attention * 0.25 +
          focus * 0.2 +
          retention * 0.15 +
          engagement_time * 0.05 +
          (Math.random() - 0.5) * 16,
      ),
    )

    // Assign cluster based on performance patterns
    let cluster = 0
    if (assessment_score >= 85)
      cluster = 1 // High Performers
    else if (attention < 60 || focus < 60)
      cluster = 2 // Attention Seekers
    else if (assessment_score < 70)
      cluster = 3 // Developing Learners
    else cluster = 0 // Balanced Learners

    allStudents.push({
      student_id: `STU${i.toString().padStart(4, "0")}`,
      name: `${firstName} ${lastName}`,
      class: className,
      comprehension: Math.round(comprehension * 10) / 10,
      attention: Math.round(attention * 10) / 10,
      focus: Math.round(focus * 10) / 10,
      retention: Math.round(retention * 10) / 10,
      assessment_score: Math.round(assessment_score * 10) / 10,
      engagement_time: Math.round(engagement_time * 10) / 10,
      cluster,
    })
  }

  return allStudents
}
