# Quick Start Guide

Get AccidentGeo running in 5 minutes.

## 1️⃣ Install Dependencies

```bash
cd accident-geolocation
npm install
```

**Time: ~3 minutes** (depending on internet speed)

## 2️⃣ Start Development Server

```bash
npm run dev
```

You'll see:
```
> next dev

▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Environments: .env.local
```

**Time: ~30 seconds**

## 3️⃣ Open in Browser

Navigate to: **[http://localhost:3000](http://localhost:3000)**

You'll be redirected to `/login`

## 4️⃣ Login with Demo Credentials

**Email:** `investigator@accident-geo.local`  
**Password:** `password123`

You're now logged in! ✅

## 5️⃣ Explore the Application

### Dashboard
See an overview of all investigations with stats.

### Create New Investigation
- Click "New Investigation" button
- Fill in case details (accident date, description)
- Upload an image (drag & drop supported)
- Watch the AI analysis progress
- View results with predicted location

### View Investigations
Browse all cases with filtering by status and confidence.

## What's Included

✅ **Complete Frontend**: All pages and components  
✅ **Mock API**: Realistic data for testing  
✅ **TypeScript**: Full type safety  
✅ **Responsive Design**: Desktop, tablet, mobile  
✅ **Authentication**: User login/logout  
✅ **Image Processing**: Upload with validation  
✅ **AI Workflow**: Analysis progress visualization  
✅ **Results Display**: Confidence scores, candidates, evidence  
✅ **Case Management**: Search, filter, view history  

 ## Key Features to Try

### 1. New Investigation Workflow
```
Case Details → Image Upload → Analysis Progress → Results
```

### 2. Results Page (The Star ⭐)
- Original accident image
- AI-predicted location
- Confidence score visualization
- Similar reference images
- Alternative location candidates
- Location evidence breakdown

### 3. Search & Filter
- Search by case ID or description
- Filter by investigation status
- Filter by confidence level

### 4. View Previous Cases
- Click any investigation in dashboard
- See full details and results
- Copy coordinates with one click

## Common Tasks

### Change Mock Data
Edit `src/lib/api/mock.ts` to customize:
- Investigation data
- Reference images
- Locations
- Confidence scores
- Evidence types

### Adjust Analysis Speed
In `src/lib/api/mock.ts`, modify delays:
```typescript
const analysisStages = [
  { step: 1, label: 'Image uploaded', duration: 0 },
  { step: 2, label: 'Image quality checked', duration: 800 }, // ← Adjust here
  // ...
]
```

### Add a New Page
```bash
mkdir -p src/app/new-page
```

Create `src/app/new-page/page.tsx`:
```typescript
'use client'
import { AppLayout } from '@/components/layout/AppLayout'

export default function NewPage() {
  return (
    <AppLayout>
      <div className="page-container">
        <h1>New Page</h1>
      </div>
    </AppLayout>
  )
}
```

### Stop the Server
Press `Ctrl+C` in terminal

## Next Steps

### For Development
1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed patterns
2. Explore `src/lib/api/mock.ts` to understand mock structure
3. Review component architecture in `src/components/`
4. Check type definitions in `src/types/index.ts`

### For Integration
1. Read [README.md](./README.md) "Switching from Mock to Real API" section
2. Implement FastAPI backend endpoints
3. Update `src/lib/api/client.ts` with real API calls
4. Remove/archive mock API when ready

### For Production
1. Set up environment variables (see `.env.example`)
2. Configure Google Maps API key (when implementing map)
3. Choose hosting platform (Vercel recommended)
4. Set up CI/CD pipeline
5. Configure security headers and CORS

## Troubleshooting

### Page shows "Loading..." forever
- Check browser console for errors (F12)
- Restart dev server: `npm run dev`
- Clear cache: Delete `.next` folder, run `npm run dev` again

### Images not showing
- The mock API uses Unsplash URLs (requires internet)
- Check browser network tab (F12 → Network)
- Images should load from unsplash.com

### Form not submitting
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Look for validation error messages

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

## Project Structure at a Glance

```
src/
├── app/              # Pages (dashboard, login, investigations, etc.)
├── components/       # Reusable React components
├── contexts/         # Auth context for state management
├── lib/api/          # API client (mock & real)
└── types/            # TypeScript type definitions
```

## System Architecture

```
Browser
   ↓
Next.js Frontend
   ↓
API Client (mock or real)
   ↓
Mock Service (for now)
   ↓
Realistic Investigation Data
```

When FastAPI backend is ready:
```
Browser
   ↓
Next.js Frontend
   ↓
API Client
   ↓
FastAPI Backend
   ↓
PostgreSQL + S3 + ML Pipeline
```

## Performance Notes

- ⚡ First load: ~3-5 seconds
- ⚡ Page navigation: Near instant (client-side routing)
- ⚡ Image analysis simulation: ~7-8 seconds (configurable)
- ⚡ Real analysis will depend on ML model speed

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Help

1. **Check documentation**: Read README.md and DEVELOPMENT.md
2. **Check mock API**: Review `src/lib/api/mock.ts`
3. **Check components**: Browse `src/components/`
4. **Check types**: Review `src/types/index.ts`

## Ready to Integrate?

When your FastAPI backend is ready:

1. **Implement backend endpoints** following the API contract in README.md
2. **Update `src/lib/api/client.ts`** with real API calls
3. **Update environment variables** in `.env.local`
4. **Test thoroughly** with real backend data
5. **Deploy** to production

## Success! 🎉

You now have a production-quality accident geolocation frontend running locally. 

**Next milestone**: Integrate with FastAPI backend!

---

**Questions?** See README.md for detailed documentation and integration guide.
