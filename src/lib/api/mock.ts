import { Investigation, Candidate, Evidence, User } from '@/types'

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock reference images database
const referenceImages = [
  {
    id: 'ref-1',
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  },
  {
    id: 'ref-2',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9756, longitude: 77.6019 },
  },
  {
    id: 'ref-3',
    url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9352, longitude: 77.6245 },
  },
  {
    id: 'ref-4',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 13.0827, longitude: 77.6171 },
  },
]

// Mock investigation data
export const mockInvestigations: Investigation[] = [
  {
    id: 'ACC-2026-00124',
    status: 'completed',
    createdAt: '2026-08-18T10:30:00Z',
    updatedAt: '2026-08-18T10:45:00Z',
    caseInfo: {
      caseId: 'ACC-2026-00124',
      accidentDate: '2026-08-18',
      accidentTime: '09:15',
      description: 'Vehicle collision at major intersection. Three vehicles involved.',
      referenceNumber: 'POL-2026-1547',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      fileName: 'accident_scene_01.jpg',
      fileSize: 2457600,
      uploadedAt: '2026-08-18T10:30:00Z',
    },
    results: {
      location: {
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      confidence: 0.874,
      candidates: [
        {
          rank: 1,
          location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
          confidence: 0.874,
          similarity: 0.917,
          imageUrl: referenceImages[0].url,
        },
        {
          rank: 2,
          location: { city: 'Hosur', state: 'Karnataka', country: 'India', latitude: 12.7409, longitude: 77.8253 },
          confidence: 0.712,
          similarity: 0.768,
          imageUrl: referenceImages[1].url,
        },
        {
          rank: 3,
          location: { city: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867 },
          confidence: 0.638,
          similarity: 0.654,
          imageUrl: referenceImages[2].url,
        },
        {
          rank: 4,
          location: { city: 'Mysuru', state: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394 },
          confidence: 0.584,
          similarity: 0.601,
          imageUrl: referenceImages[3].url,
        },
      ],
      evidence: [
        { label: 'Road Geometry', strength: 'strong' },
        { label: 'Intersection Structure', strength: 'strong' },
        { label: 'Road Markings', strength: 'moderate' },
        { label: 'Building Layout', strength: 'strong' },
        { label: 'Traffic Infrastructure', strength: 'moderate' },
        { label: 'Environmental Features', strength: 'moderate' },
      ],
      processedAt: '2026-08-18T10:45:00Z',
    },
  },
  {
    id: 'ACC-2026-00123',
    status: 'completed',
    createdAt: '2026-08-17T14:20:00Z',
    updatedAt: '2026-08-17T14:35:00Z',
    caseInfo: {
      caseId: 'ACC-2026-00123',
      accidentDate: '2026-08-17',
      accidentTime: '14:00',
      description: 'Single vehicle accident. Vehicle hit power pole.',
      referenceNumber: 'POL-2026-1546',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      fileName: 'accident_scene_02.jpg',
      fileSize: 1875200,
      uploadedAt: '2026-08-17T14:20:00Z',
    },
    results: {
      location: {
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        latitude: 17.3850,
        longitude: 78.4867,
      },
      confidence: 0.812,
      candidates: [
        {
          rank: 1,
          location: { city: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867 },
          confidence: 0.812,
          similarity: 0.856,
          imageUrl: referenceImages[2].url,
        },
      ],
      evidence: [
        { label: 'Road Geometry', strength: 'strong' },
        { label: 'Intersection Structure', strength: 'moderate' },
        { label: 'Road Markings', strength: 'strong' },
      ],
      processedAt: '2026-08-17T14:35:00Z',
    },
  },
  {
    id: 'ACC-2026-00122',
    status: 'analyzing',
    createdAt: '2026-08-17T11:10:00Z',
    updatedAt: '2026-08-17T11:15:00Z',
    caseInfo: {
      caseId: 'ACC-2026-00122',
      accidentDate: '2026-08-17',
      accidentTime: '10:45',
      description: 'Multi-vehicle pileup on highway.',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
      fileName: 'accident_scene_03.jpg',
      fileSize: 3120400,
      uploadedAt: '2026-08-17T11:10:00Z',
    },
  },
]

// Mock user
const mockUser: User = {
  id: 'user-1',
  email: 'investigator@accident-geo.local',
  name: 'Sarah Anderson',
  createdAt: '2025-01-01T00:00:00Z',
}

// Simulated analysis stages
export const analysisStages = [
  { step: 1, label: 'Image uploaded', duration: 0 },
  { step: 2, label: 'Image quality checked', duration: 800 },
  { step: 3, label: 'Visual features extracted', duration: 1600 },
  { step: 4, label: 'Geographic features analyzed', duration: 2400 },
  { step: 5, label: 'Searching reference imagery', duration: 4000 },
  { step: 6, label: 'Ranking candidate locations', duration: 5600 },
  { step: 7, label: 'Verifying geographic match', duration: 7000 },
]

// Mock API service
export const mockApi = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    await delay(800)
    if (email && password) {
      return mockUser
    }
    throw new Error('Invalid credentials')
  },

  logout: async (): Promise<void> => {
    await delay(300)
  },

  getMe: async (): Promise<User> => {
    await delay(200)
    return mockUser
  },

  // Investigations
  listInvestigations: async (): Promise<Investigation[]> => {
    await delay(600)
    return mockInvestigations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getInvestigation: async (id: string): Promise<Investigation> => {
    await delay(400)
    const investigation = mockInvestigations.find(i => i.id === id)
    if (!investigation) throw new Error('Investigation not found')
    return investigation
  },

  createInvestigation: async (caseInfo: any): Promise<Investigation> => {
    await delay(500)
    const id = `ACC-2026-${String(mockInvestigations.length + 125).padStart(5, '0')}`
    const investigation: Investigation = {
      id,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      caseInfo: {
        caseId: id,
        ...caseInfo,
      },
    }
    mockInvestigations.unshift(investigation)
    return investigation
  },

  uploadImage: async (
    investigationId: string,
    file: File
  ): Promise<{ url: string; fileName: string; fileSize: number }> => {
    // Simulate upload with progress
    await delay(1200)
    
    const investigation = mockInvestigations.find(i => i.id === investigationId)
    if (!investigation) throw new Error('Investigation not found')

    const mockUrl = `data:${file.type};base64,` + 
      Buffer.from(await file.arrayBuffer()).toString('base64')

    investigation.image = {
      url: mockUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    }
    investigation.status = 'uploaded'
    investigation.updatedAt = new Date().toISOString()

    return investigation.image
  },

  analyzeImage: async (investigationId: string): Promise<void> => {
    const investigation = mockInvestigations.find(i => i.id === investigationId)
    if (!investigation) throw new Error('Investigation not found')

    investigation.status = 'analyzing'
    investigation.updatedAt = new Date().toISOString()

    // Simulate full analysis pipeline
    await delay(500)
    investigation.status = 'searching'
    await delay(1600)
    investigation.status = 'ranking'
    await delay(1400)
    investigation.status = 'verifying'
    await delay(1200)

    // Generate results
    const confidenceVariation = Math.random() * 0.1 - 0.05
    investigation.results = {
      location: {
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        latitude: 12.9716 + (Math.random() * 0.05 - 0.025),
        longitude: 77.5946 + (Math.random() * 0.05 - 0.025),
      },
      confidence: Math.max(0.4, Math.min(0.95, 0.87 + confidenceVariation)),
      candidates: [
        {
          rank: 1,
          location: {
            city: 'Bengaluru',
            state: 'Karnataka',
            country: 'India',
            latitude: 12.9716,
            longitude: 77.5946,
          },
          confidence: Math.max(0.4, Math.min(0.95, 0.87 + confidenceVariation)),
          similarity: 0.917,
          imageUrl: referenceImages[0].url,
        },
        {
          rank: 2,
          location: {
            city: 'Hosur',
            state: 'Karnataka',
            country: 'India',
            latitude: 12.7409,
            longitude: 77.8253,
          },
          confidence: 0.712,
          similarity: 0.768,
          imageUrl: referenceImages[1].url,
        },
        {
          rank: 3,
          location: {
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India',
            latitude: 17.3850,
            longitude: 78.4867,
          },
          confidence: 0.638,
          similarity: 0.654,
          imageUrl: referenceImages[2].url,
        },
        {
          rank: 4,
          location: {
            city: 'Mysuru',
            state: 'Karnataka',
            country: 'India',
            latitude: 12.2958,
            longitude: 76.6394,
          },
          confidence: 0.584,
          similarity: 0.601,
          imageUrl: referenceImages[3].url,
        },
      ],
      evidence: [
        { label: 'Road Geometry', strength: 'strong' },
        { label: 'Intersection Structure', strength: 'strong' },
        { label: 'Road Markings', strength: 'moderate' },
        { label: 'Building Layout', strength: 'strong' },
        { label: 'Traffic Infrastructure', strength: 'moderate' },
        { label: 'Environmental Features', strength: 'moderate' },
      ],
      processedAt: new Date().toISOString(),
    }

    investigation.status = 'completed'
    investigation.updatedAt = new Date().toISOString()
  },

  getAnalysisStatus: async (investigationId: string): Promise<{ status: string; progress: number }> => {
    const investigation = mockInvestigations.find(i => i.id === investigationId)
    if (!investigation) throw new Error('Investigation not found')

    const statusToProgress: Record<string, number> = {
      uploaded: 15,
      analyzing: 30,
      searching: 55,
      ranking: 70,
      verifying: 85,
      completed: 100,
      failed: 0,
    }

    return {
      status: investigation.status,
      progress: statusToProgress[investigation.status] || 0,
    }
  },
}
