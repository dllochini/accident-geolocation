// This is the abstraction layer that can be switched between mock and real APIs
// When the FastAPI backend is ready, simply replace mockApi with realApi

import { mockApi } from './mock'
import type { Investigation, User } from '@/types'

// For now, use mock API
// In production, replace with real API client that calls FastAPI endpoints
export const apiClient = {
  // Authentication endpoints
  login: (email: string, password: string) => 
    mockApi.login(email, password),
  
  logout: () => 
    mockApi.logout(),
  
  getMe: () => 
    mockApi.getMe(),

  // Investigation endpoints
  listInvestigations: () => 
    mockApi.listInvestigations(),
  
  getInvestigation: (id: string) => 
    mockApi.getInvestigation(id),
  
  createInvestigation: (caseInfo: {
    accidentDate: string
    accidentTime?: string
    description?: string
    referenceNumber?: string
  }) => mockApi.createInvestigation(caseInfo),
  
  uploadImage: (investigationId: string, file: File) => 
    mockApi.uploadImage(investigationId, file),
  
  analyzeImage: (investigationId: string) => 
    mockApi.analyzeImage(investigationId),
  
  getAnalysisStatus: (investigationId: string) => 
    mockApi.getAnalysisStatus(investigationId),
}

// Type for API responses
export type ApiClient = typeof apiClient

/* 
INTEGRATION GUIDE FOR FASTAPI BACKEND:

When the Python FastAPI backend is ready, create a realApi object:

export const realApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  },
  
  // ... implement other endpoints similarly
}

Then switch the export:
export const apiClient = process.env.NODE_ENV === 'production' 
  ? realApi 
  : mockApi
*/
