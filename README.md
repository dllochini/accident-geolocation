# AccidentGeo: AI-Powered Accident Geolocation Platform

A production-quality frontend for AI-powered accident image geolocation. This application allows investigators to upload accident photographs, receive AI-powered location predictions, and explore candidate locations with detailed evidence.

## Overview

**AccidentGeo** is an enterprise geospatial investigation platform designed for professional accident scene analysis. The frontend is completely model-agnostic and works with any underlying ML pipeline (DINO, CLIP, SigLIP, VIGOR, custom ViT, etc.).

### Key Features

- 🔐 **Secure Authentication**: Mocked login with token-based sessions
- 📸 **Image Upload**: Drag-and-drop image upload with validation
- 🤖 **AI Analysis**: Real-time processing stages and progress tracking
- 📍 **Location Prediction**: AI-predicted accident location with confidence scores
- 🔍 **Reference Imagery**: Visual comparison with similar street-level images
- 🗺️ **Geographic Candidates**: Alternative location rankings with full details
- 📊 **Evidence Display**: Human-readable location evidence (not raw embeddings)
- 📋 **Case Management**: Search, filter, and manage investigation history
- ⚙️ **Settings**: User preferences and notification management
- 📱 **Responsive**: Desktop, tablet, and mobile-friendly design

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hook Form + Zod**: Form management and validation
- **TanStack Query**: Data fetching and caching
- **Lucide React**: Icon library
- **Framer Motion**: Smooth animations

### Database/Storage (Backend Integration)
- PostgreSQL + pgvector (for embeddings)
- S3-compatible object storage
- Redis (for background jobs)

### API
- FastAPI (Python backend)
- RESTful API contract

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Index (redirects to dashboard)
│   ├── globals.css          # Global styles
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard with stats & recent cases
│   ├── investigations/
│   │   ├── page.tsx         # Investigations list with filters
│   │   ├── new/
│   │   │   └── page.tsx     # New investigation workflow
│   │   └── [id]/
│   │       ├── page.tsx     # Investigation results (signature screen)
│   │       └── analysis/
│   │           └── page.tsx # Analysis progress
│   └── settings/
│       └── page.tsx         # User settings
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── AppLayout.tsx    # App wrapper with auth
│   │ 
│   └── common/
│       └── StatusBadge.tsx  # Status & confidence badges
│
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
│
├── lib/
│   └── api/
│       ├── client.ts        # API client abstraction
│       └── mock.ts          # Mock API with realistic data
│
└── types/
    └── index.ts             # TypeScript type definitions
```

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/accident-geolocation.git
   cd accident-geolocation
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Login with demo credentials**
   - Email: `investigator@accident-geo.local`
   - Password: `password123`

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google Maps API (when implementing map view)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Authentication
NEXT_PUBLIC_AUTH_PROVIDER=mock  # Change to 'fastapi' when ready

# Feature Flags
NEXT_PUBLIC_ENABLE_MAP_VIEW=true
NEXT_PUBLIC_ENABLE_EXPORT=false
```

## Mock API Overview

The application ships with a complete mock API service (`src/lib/api/mock.ts`) that simulates:

- User authentication
- Investigation creation and retrieval
- Image upload with progress tracking
- Full analysis pipeline with realistic processing stages
- Candidate location ranking
- Evidence generation

### Mock Data

The mock service includes realistic accident investigation data with:
- Multiple investigation states
- Various confidence levels
- Reference imagery database
- Geographic location data for India (Bengaluru, Hyderabad, Mysuru, Hosur)

### Switching from Mock to Real API

When your FastAPI backend is ready, implement the real API calls in `src/lib/api/client.ts`:

```typescript
// Before: Using mock
export const apiClient = mockApi

// After: Using real FastAPI backend
export const realApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  },
  
  // Implement other endpoints similarly...
}

export const apiClient = process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'fastapi'
  ? realApi
  : mockApi
```

## API Contract (FastAPI Backend)

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Investigations
```
GET    /api/v1/investigations
GET    /api/v1/investigations/{id}
POST   /api/v1/investigations
PUT    /api/v1/investigations/{id}
```

### Image Upload & Analysis
```
POST   /api/v1/investigations/{id}/upload
POST   /api/v1/investigations/{id}/analyze
GET    /api/v1/investigations/{id}/status
GET    /api/v1/investigations/{id}/results
```

### Expected Response Format

```json
{
  "id": "ACC-2026-00124",
  "status": "completed",
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
      "location": { ... },
      "confidence": 0.874,
      "similarity": 0.917,
      "imageUrl": "/path/to/reference.jpg"
    },
    ...
  ],
  "evidence": [
    {
      "label": "Road Geometry",
      "strength": "strong"
    },
    ...
  ]
}
```

## Design Philosophy

### Enterprise & Professional
- Clean, minimal aesthetic inspired by geospatial intelligence platforms
- Strong visual hierarchy and generous whitespace
- Restrained color palette (slate, indigo, emerald, amber, rose)
- Professional typography (Inter + IBM Plex Mono)

### Model-Agnostic
- No ML model hardcoding
- Flexible evidence display
- Abstracted API layer
- Easy to swap between different ML backends

### Explainability
- Original accident image prominently displayed
- Visual comparison with similar reference images
- Human-readable evidence categories
- Alternative candidates with detailed rankings
- Confidence scores with appropriate caveats

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Semantic HTML
- Visible focus states
- Sufficient color contrast

## Development Guide

### Adding a New Page

1. Create a new directory in `src/app/` (e.g., `src/app/new-feature/`)
2. Create `page.tsx` with your component
3. Wrap with `AppLayout` if it requires authentication:

```typescript
'use client'

import { AppLayout } from '@/components/layout/AppLayout'

export default function NewFeaturePage() {
  return (
    <AppLayout>
      <div className="page-container">
        {/* Your content */}
      </div>
    </AppLayout>
  )
}
```

### Creating Reusable Components

Place components in `src/components/` organized by domain:

```typescript
// src/components/investigation/MyComponent.tsx
'use client'

import { Investigation } from '@/types'

interface MyComponentProps {
  investigation: Investigation
}

export function MyComponent({ investigation }: MyComponentProps) {
  return (
    // Component JSX
  )
}
```

### Styling

Use Tailwind CSS classes and the custom CSS layer utilities:

- `.btn-primary` / `.btn-secondary` / `.btn-ghost`
- `.card` (rounded, bordered, shadowed)
- `.page-container` (max-width, centered)
- `.badge` / `.badge-success` / `.badge-warning` / `.badge-error`
- `.grid-auto-fit` (responsive grid)

### Type Safety

All data structures are defined in `src/types/index.ts`. Import and use them:

```typescript
import { Investigation, Candidate, Evidence } from '@/types'
```

## Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for below-fold content
- Memoized components to prevent unnecessary re-renders
- Optimized Tailwind CSS purging
- Code splitting with Next.js dynamic imports

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Security Considerations

### Currently (Development)
- Mocked authentication for demo purposes
- Client-side token storage (for demo only)

### Production Checklist
- [ ] Implement real FastAPI authentication
- [ ] Use secure HTTP-only cookies for tokens
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable HTTPS only
- [ ] Implement content security policy
- [ ] Add audit logging
- [ ] Regular security audits
- [ ] Encrypt sensitive data at rest

### Privacy
- Images are stored server-side only
- Implement proper data retention policies
- GDPR/data protection compliance
- Audit trail for investigation access

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy with one click

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-Hosted

```bash
npm run build
npm start
```

## Testing

### Unit Tests (Recommended Setup)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### E2E Tests (Recommended Setup)
```bash
npm install --save-dev playwright
```

## Troubleshooting

### Issue: Mock data not loading
- Clear browser cache and localStorage
- Restart dev server: `npm run dev`

### Issue: Images not displaying
- Check image URLs in mock data
- Verify CORS settings if using external images
- Use Unsplash/Pexels URLs which support CORS

### Issue: Form validation not working
- Ensure Zod schema matches form fields
- Check React Hook Form setup in component
- Verify error message display

## Future Enhancements

### Planned Features
- [ ] Google Maps integration with satellite view
- [ ] Real-time collaboration features
- [ ] Report generation and export (PDF, CSV)
- [ ] Advanced analytics dashboard
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Webhook support for integrations
- [ ] Mobile native apps (React Native)
- [ ] Offline support
- [ ] Advanced filtering and search
- [ ] Custom model pipeline management

### ML Model Integration
When integrating your ML model:

1. Implement `/api/v1/investigations/{id}/analyze` endpoint
2. Support streaming status updates
3. Return standardized result format
4. Implement evidence extraction
5. Support multiple model versions

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary. All rights reserved.

## Support

For issues, questions, or integration help:
- 📧 Email: support@accident-geo.local
- 📖 Docs: https://docs.accident-geo.local
- 🐛 Issues: GitHub Issues

## Architecture Notes

### Why This Structure?

- **App Router**: Modern Next.js patterns with better type safety
- **Server Components**: Default for better performance
- **Client Components**: Only where interactivity is needed ('use client')
- **API Abstraction**: Easy to swap mock ↔ real API
- **Type-First**: TypeScript everywhere ensures correctness
- **Component Library**: Reusable, well-organized components

### Model Agnosticism

The frontend doesn't assume:
- Which model is used (DINO, CLIP, SigLIP, VIGOR, custom, ensemble)
- Model output format or structure
- Specific embedding dimensions
- GPU/CPU inference location

It only expects:
- Standardized API responses
- Confidence scores (0-1 range)
- Location data (lat/lon)
- Evidence categories (human-readable labels)

This flexibility means you can:
- A/B test different models
- Switch models in production
- Ensemble multiple models
- Update models without UI changes

---

**Built with attention to detail for enterprise production use.**
