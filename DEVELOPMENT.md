# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code (if configured)
npm run format
```

## Development Workflow

### 1. Working with Mock API

The entire application runs with mock data. To test:

1. **Add new mock data**: Edit `src/lib/api/mock.ts`
2. **Change analysis speed**: Modify delay values in `analysisStages`
3. **Add new investigation status**: Update `InvestigationStatus` type and handlers

Example - Add a new field to Investigation:

```typescript
// 1. Update type in src/types/index.ts
export interface Investigation {
  id: string
  // ... existing fields
  customField?: string  // Add here
}

// 2. Update mock data in src/lib/api/mock.ts
const mockInvestigations: Investigation[] = [
  {
    id: 'ACC-2026-00124',
    // ... existing data
    customField: 'value'  // Add here
  }
]

// 3. Use in component
import { Investigation } from '@/types'

export function MyComponent({ investigation }: { investigation: Investigation }) {
  return <div>{investigation.customField}</div>
}
```

### 2. Creating New Pages

All pages live in `src/app/`. The file structure maps directly to routes:

- `src/app/dashboard/page.tsx` → `/dashboard`
- `src/app/investigations/new/page.tsx` → `/investigations/new`
- `src/app/investigations/[id]/page.tsx` → `/investigations/ACC-2026-00124`

Template for authenticated pages:

```typescript
'use client'

import { AppLayout } from '@/components/layout/AppLayout'

export default function PageName() {
  return (
    <AppLayout>
      <div className="page-container">
        <h1>Page Title</h1>
        {/* Content */}
      </div>
    </AppLayout>
  )
}
```

### 3. Working with Forms

Using React Hook Form + Zod:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Minimum 10 characters'),
})

type FormData = z.infer<typeof schema>

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Handle submission
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p className="text-rose-600">{errors.email.message}</p>}

      <textarea {...register('message')} />
      {errors.message && <p className="text-rose-600">{errors.message.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### 4. Using the API Client

```typescript
'use client'

import { apiClient } from '@/lib/api/client'
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [investigations, setInvestigations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.listInvestigations()
        setInvestigations(data)
      } catch (error) {
        console.error('Failed to load:', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {investigations.map(inv => (
        <div key={inv.id}>{inv.id}</div>
      ))}
    </div>
  )
}
```

### 5. Styling with Tailwind

Use utility classes for styling:

```tsx
// Basic button
<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
  Click me
</button>

// Using custom utilities
<button className="btn-primary">Sign In</button>

// Card with shadow
<div className="card p-6">
  <h2 className="section-title">Title</h2>
  <p className="text-slate-600">Description</p>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => (
    <div key={item.id} className="card p-4">
      {item.name}
    </div>
  ))}
</div>
```

### 6. Type Safety Best Practices

Always import and use types:

```typescript
import { Investigation, Candidate, Evidence } from '@/types'

interface MyComponentProps {
  investigation: Investigation
  onSelect: (candidate: Candidate) => void
}

export function MyComponent({ investigation, onSelect }: MyComponentProps) {
  return (
    // Component using typed props
  )
}
```

## Common Patterns

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(true)

return isLoading ? (
  <div className="p-12 text-center">
    <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse mx-auto mb-4" />
    <p className="text-slate-600">Loading...</p>
  </div>
) : (
  // Content
)
```

### Error States

```tsx
const [error, setError] = useState<string | null>(null)

if (error) {
  return (
    <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
      <AlertCircle size={20} />
      <p>{error}</p>
    </div>
  )
}
```

### Empty States

```tsx
if (items.length === 0) {
  return (
    <div className="p-12 text-center">
      <p className="text-slate-600 mb-4">No items found.</p>
      <Link href="/create" className="btn-primary">
        Create Your First Item
      </Link>
    </div>
  )
}
```

## Debugging

### Browser DevTools
- Use React Developer Tools extension
- Check Redux DevTools if using state management
- Network tab to inspect API calls

### Console Logging
```typescript
console.log('Debug:', { variable, object })
console.error('Error:', error)
console.warn('Warning:', message)
```

### Next.js Debug
Add to `next.config.js`:
```javascript
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

## Performance Tips

1. **Use Next.js Image Component**
   ```tsx
   import Image from 'next/image'
   <Image src="/photo.jpg" alt="Photo" width={400} height={300} />
   ```

2. **Lazy Load Components**
   ```tsx
   const Component = dynamic(() => import('./Component'))
   ```

3. **Memoize Components**
   ```tsx
   import { memo } from 'react'
   export const MyComponent = memo(function MyComponent({ prop }) {
     return <div>{prop}</div>
   })
   ```

4. **Use useCallback for Functions**
   ```tsx
   const handleClick = useCallback(() => {
     // Handle click
   }, [])
   ```

## Code Quality

### ESLint
```bash
npm run lint
```

### Type Checking
TypeScript types are checked during build. For manual check:
```bash
npx tsc --noEmit
```

## Browser Testing

### Test Responsive Design
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes

### Test Accessibility
1. Install WAVE extension
2. Axe DevTools for automated checks
3. Keyboard navigation (Tab key)

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add feature description"

# Push and create PR
git push origin feature/my-feature
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit

# Clear cache
rm -rf .next
npm run dev
```

### Images Not Loading
- Check image URL in browser console
- Verify image exists
- Check Next.js image optimization config

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Login with demo credentials
4. ✅ Create a test investigation
5. ✅ Explore all features
6. ✅ Review mock API implementation
7. ✅ Plan integration with FastAPI backend

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev)

## Questions?

Refer to README.md for project overview and architecture.
