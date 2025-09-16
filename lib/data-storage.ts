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

// Only return uploaded data, no mock data generation
export function generateMockStudents(): StudentData[] {
  // Check if we have saved data in localStorage
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
      console.error('Error loading data from localStorage:', error);
    }
  }
  // Return empty array if no data is available
  return [];
}
