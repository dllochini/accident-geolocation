// Investigation Status
export type InvestigationStatus = 
  | 'draft' 
  | 'uploaded' 
  | 'analyzing' 
  | 'searching' 
  | 'ranking' 
  | 'verifying' 
  | 'completed' 
  | 'failed'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

// Location
export interface Location {
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
}

// Evidence
export interface Evidence {
  label: string
  strength: 'strong' | 'moderate' | 'weak'
}

// Candidate Location
export interface Candidate {
  rank: number
  location: Location
  confidence: number
  similarity: number
  imageUrl: string
  referenceImageId?: string
}

// Investigation
export interface Investigation {
  id: string
  status: InvestigationStatus
  createdAt: string
  updatedAt: string
  caseInfo: {
    caseId: string
    accidentDate: string
    accidentTime?: string
    description?: string
    referenceNumber?: string
  }
  image?: {
    url: string
    fileName: string
    fileSize: number
    uploadedAt: string
  }
  results?: {
    location: Location
    confidence: number
    candidates: Candidate[]
    evidence: Evidence[]
    processedAt: string
  }
}

// API Responses
export interface ApiResponse<T> {
  data: T
  error?: {
    message: string
    code: string
  }
}

// User
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

// Auth Context
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Upload Progress
export interface UploadProgress {
  loaded: number
  total: number
  progress: number
}
