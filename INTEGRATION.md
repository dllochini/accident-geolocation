# FastAPI Backend Integration Guide

Step-by-step instructions for connecting your Python FastAPI backend to this frontend.

## Overview

The frontend currently uses a **mock API** for development. When your FastAPI backend is ready, you'll:

1. Implement the API endpoints
2. Update the frontend API client
3. Update environment variables
4. Test end-to-end
5. Deploy together

## API Endpoints Required

Your FastAPI backend must implement these endpoints:

### Authentication

```
POST /api/v1/auth/login
```
Request:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
Response:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

```
POST /api/v1/auth/logout
```
Response: `{ }`

```
GET /api/v1/auth/me
```
Response:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Investigations

```
GET /api/v1/investigations
```
Response:
```json
[
  {
    "id": "ACC-2026-00124",
    "status": "completed",
    "createdAt": "2026-08-18T10:30:00Z",
    "updatedAt": "2026-08-18T10:45:00Z",
    "caseInfo": {
      "caseId": "ACC-2026-00124",
      "accidentDate": "2026-08-18",
      "accidentTime": "09:15",
      "description": "Vehicle collision",
      "referenceNumber": "POL-2026-1547"
    },
    "image": {
      "url": "https://...",
      "fileName": "accident.jpg",
      "fileSize": 2457600,
      "uploadedAt": "2026-08-18T10:30:00Z"
    },
    "results": {
      "location": {
        "city": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "confidence": 0.874,
      "candidates": [...],
      "evidence": [...],
      "processedAt": "2026-08-18T10:45:00Z"
    }
  }
]
```

```
GET /api/v1/investigations/{id}
```
Response: Single investigation object (same format as above)

```
POST /api/v1/investigations
```
Request:
```json
{
  "accidentDate": "2026-08-18",
  "accidentTime": "09:15",
  "description": "Vehicle collision at intersection",
  "referenceNumber": "POL-2026-1547"
}
```
Response:
```json
{
  "id": "ACC-2026-00124",
  "status": "draft",
  "createdAt": "2026-08-18T10:30:00Z",
  "updatedAt": "2026-08-18T10:30:00Z",
  "caseInfo": {...}
}
```

```
POST /api/v1/investigations/{id}/upload
```
Request: Multipart form data with file
```
file: <binary image data>
```
Response:
```json
{
  "url": "https://storage.example.com/images/...",
  "fileName": "accident.jpg",
  "fileSize": 2457600,
  "uploadedAt": "2026-08-18T10:30:00Z"
}
```

**Update investigation status to `uploaded` after successful upload**

```
POST /api/v1/investigations/{id}/analyze
```
Request: `{ }`

Response: `{ }`

**Trigger background job to process the image. Stream status updates to `/api/v1/investigations/{id}/status`**

```
GET /api/v1/investigations/{id}/status
```
Response:
```json
{
  "status": "searching",
  "progress": 55,
  "message": "Searching reference imagery..."
}
```

Possible status values:
- `uploaded`
- `analyzing`
- `searching`
- `ranking`
- `verifying`
- `completed`
- `failed`

```
GET /api/v1/investigations/{id}/results
```
Response:
```json
{
  "location": {
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "confidence": 0.874,
  "candidates": [
    {
      "rank": 1,
      "location": {...},
      "confidence": 0.874,
      "similarity": 0.917,
      "imageUrl": "https://..."
    }
  ],
  "evidence": [
    {
      "label": "Road Geometry",
      "strength": "strong"
    }
  ],
  "processedAt": "2026-08-18T10:45:00Z"
}
```

## Frontend Integration Steps

### Step 1: Update Environment Variables

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_PROVIDER=fastapi
```

### Step 2: Implement Real API Client

Edit `src/lib/api/client.ts`:

```typescript
import type { Investigation, User } from '@/types'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const realApi = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }
    return response.json()
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Logout failed')
  },

  getMe: async (): Promise<User> => {
    const response = await fetch(`${apiUrl}/auth/me`, {
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to get user')
    return response.json()
  },

  // Investigations
  listInvestigations: async (): Promise<Investigation[]> => {
    const response = await fetch(`${apiUrl}/investigations`, {
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to list investigations')
    return response.json()
  },

  getInvestigation: async (id: string): Promise<Investigation> => {
    const response = await fetch(`${apiUrl}/investigations/${id}`, {
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to get investigation')
    return response.json()
  },

  createInvestigation: async (caseInfo: any): Promise<Investigation> => {
    const response = await fetch(`${apiUrl}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(caseInfo),
    })
    if (!response.ok) throw new Error('Failed to create investigation')
    return response.json()
  },

  uploadImage: async (
    investigationId: string,
    file: File
  ): Promise<{ url: string; fileName: string; fileSize: number }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      `${apiUrl}/investigations/${investigationId}/upload`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    )
    if (!response.ok) throw new Error('Failed to upload image')
    return response.json()
  },

  analyzeImage: async (investigationId: string): Promise<void> => {
    const response = await fetch(
      `${apiUrl}/investigations/${investigationId}/analyze`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )
    if (!response.ok) throw new Error('Failed to start analysis')
  },

  getAnalysisStatus: async (
    investigationId: string
  ): Promise<{ status: string; progress: number }> => {
    const response = await fetch(
      `${apiUrl}/investigations/${investigationId}/status`,
      {
        credentials: 'include',
      }
    )
    if (!response.ok) throw new Error('Failed to get analysis status')
    return response.json()
  },
}

// Switch between mock and real API
import { mockApi } from './mock'

export const apiClient =
  process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'fastapi' ? realApi : mockApi
```

### Step 3: Handle CORS

Your FastAPI backend needs CORS configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://yourdomain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Update Auth Context (if needed)

The auth context in `src/contexts/AuthContext.tsx` currently stores tokens in localStorage. For production, consider:

```typescript
// Use HTTP-only cookies instead
// Update auth context to:
// 1. Remove localStorage.setItem('auth_token', ...)
// 2. Let the browser handle cookies automatically with credentials: 'include'
// 3. Remove localStorage.setItem('user', ...) if backend sends user data with login response
```

### Step 5: Test Integration

```bash
# 1. Start your FastAPI backend
# Make sure it's running on http://localhost:8000

# 2. Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH_PROVIDER=fastapi

# 3. Restart Next.js dev server
npm run dev

# 4. Test login
# Should call your real backend instead of mock

# 5. Test creating investigation
# Should create real database records

# 6. Test image upload
# Should save to real storage (S3)

# 7. Test analysis
# Should trigger real ML pipeline
```

## Async Analysis Pattern

For long-running analysis, implement polling in the analysis progress page:

```typescript
// src/app/investigations/[id]/analysis/page.tsx

useEffect(() => {
  const pollStatus = setInterval(async () => {
    const { status, progress } = await apiClient.getAnalysisStatus(investigationId)
    setProgress(progress)
    
    if (status === 'completed') {
      clearInterval(pollStatus)
      router.push(`/investigations/${investigationId}`)
    }
  }, 1000) // Poll every second
  
  return () => clearInterval(pollStatus)
}, [])
```

Or implement WebSocket for real-time updates:

```typescript
// Advanced: WebSocket for real-time status
const ws = new WebSocket(`ws://localhost:8000/ws/investigations/${investigationId}`)

ws.onmessage = (event) => {
  const { status, progress } = JSON.parse(event.data)
  setProgress(progress)
}
```

## Database Schema Expected

Your backend should have models roughly like:

```python
# Python/SQLAlchemy pseudocode

class User(Base):
    id: str
    email: str
    name: str
    created_at: datetime

class Investigation(Base):
    id: str
    user_id: str
    status: str  # draft, uploaded, analyzing, searching, ranking, verifying, completed, failed
    case_info: dict  # accident_date, time, description, reference_number
    image_url: str
    image_file_name: str
    image_file_size: int
    image_uploaded_at: datetime
    created_at: datetime
    updated_at: datetime

class InvestigationResult(Base):
    investigation_id: str
    location_city: str
    location_state: str
    location_country: str
    location_latitude: float
    location_longitude: float
    confidence: float
    processed_at: datetime

class Candidate(Base):
    investigation_id: str
    rank: int
    location_city: str
    location_state: str
    location_country: str
    location_latitude: float
    location_longitude: float
    confidence: float
    similarity: float
    image_url: str

class Evidence(Base):
    investigation_id: str
    label: str
    strength: str  # strong, moderate, weak
```

## ML Pipeline Integration

The `/analyze` endpoint should:

1. **Retrieve** the uploaded image
2. **Run** your ML pipeline:
   - Image encoding with vision model
   - Search reference database
   - Rank candidates by similarity
   - Verify geographic match
3. **Store** results in database
4. **Update** investigation status to `completed`

Example pseudocode:

```python
@app.post("/api/v1/investigations/{investigation_id}/analyze")
async def analyze_investigation(investigation_id: str, background_tasks):
    investigation = db.get_investigation(investigation_id)
    
    # Start background job
    background_tasks.add_task(run_analysis, investigation_id)
    
    return {}

async def run_analysis(investigation_id: str):
    investigation = db.get_investigation(investigation_id)
    image_bytes = s3.get_object(investigation.image_url)
    
    # Run ML pipeline
    embeddings = model.encode(image_bytes)
    candidates = db.search_similar_images(embeddings, limit=10)
    ranked = rank_by_confidence(candidates)
    
    # Extract evidence
    evidence = extract_evidence(image_bytes, ranked[0])
    
    # Store results
    db.create_results({
        'investigation_id': investigation_id,
        'location': ranked[0].location,
        'confidence': ranked[0].confidence,
        'candidates': ranked,
        'evidence': evidence,
    })
    
    # Update status
    db.update_investigation(investigation_id, status='completed')
```

## Common Issues & Solutions

### Issue: CORS errors
**Solution**: Check FastAPI CORS middleware configuration. Ensure `allow_credentials=True`.

### Issue: Circular redirects on login
**Solution**: Make sure auth context properly stores/validates tokens. Check cookie settings.

### Issue: Images not uploading
**Solution**: Ensure S3 bucket is accessible, CORS is configured, file permissions are correct.

### Issue: Analysis never completes
**Solution**: Check backend logs. Ensure background job queue (Celery/RQ) is running. Check ML model inference time.

### Issue: Results show old data
**Solution**: Clear browser cache (`Ctrl+Shift+Delete`). Check browser DevTools Network tab for correct API responses.

## Testing Checklist

- [ ] Login works with real credentials
- [ ] Can create new investigation
- [ ] Can upload image to S3
- [ ] Analysis starts and shows progress
- [ ] Results load correctly
- [ ] Candidate locations display
- [ ] Evidence shows
- [ ] Multiple investigations appear in history
- [ ] Can search/filter investigations
- [ ] Logout clears session
- [ ] Page refresh doesn't lose state

## Deployment Checklist

- [ ] Environment variables set correctly
- [ ] API URL points to production backend
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Database migrations completed
- [ ] Storage backend tested
- [ ] ML pipeline inference tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring/alerts set up
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Backup strategy in place

## Next Steps

1. Implement FastAPI endpoints according to API contract
2. Set up PostgreSQL + pgvector
3. Set up S3-compatible storage
4. Implement ML pipeline integration
5. Test with mock data first
6. Update this frontend's API client
7. End-to-end testing
8. Deploy to production

Good luck with your integration! 🚀
