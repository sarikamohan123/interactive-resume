# Initial Setup Guide

This document outlines the initial setup steps required to transform the current Vite React TypeScript template into the Interactive Resume application.

## Phase 1: Core Dependencies Installation

### Install Required Packages

```bash
# Backend & Authentication
npm install @supabase/supabase-js

# Routing
npm install @tanstack/react-router
npm install -D @tanstack/router-devtools @tanstack/router-vite-plugin

# State Management & API
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools

# Data Tables
npm install @tanstack/react-table

# Form Management & Validation
npm install react-hook-form @hookform/resolvers zod

# UI Components (shadcn/ui)
npx shadcn@latest init
```

### Development Dependencies

```bash
# Additional TypeScript types
npm install -D @types/node

# Prettier for code formatting
npm install -D prettier

# Additional ESLint plugins if needed
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## Phase 2: Project Structure Setup

### Create Directory Structure

```bash
# Create main directories
mkdir -p src/{components,hooks,lib,pages,routes,types,utils}

# Create component subdirectories
mkdir -p src/components/{ui,forms,layout,resume,showcase,admin}

# Create route directories for file-based routing
mkdir -p src/routes/{admin,showcase}
mkdir -p "src/routes/(resume)"

# Create additional directories
mkdir -p src/{contexts,schemas,services}
```

### Expected Directory Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (Header, Footer, etc.)
│   ├── resume/             # Resume-specific components
│   ├── showcase/           # Showcase-specific components
│   └── admin/              # Admin panel components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries and configurations
├── pages/                  # Page components
├── routes/                 # File-based routing structure
│   ├── (resume)/           # Root resume route (maps to "/")
│   ├── showcase/           # Showcase routes ("/showcase")
│   └── admin/              # Protected admin routes ("/admin")
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── contexts/               # React contexts
├── schemas/                # Zod validation schemas
└── services/               # API service functions
```

## Phase 3: Configuration Setup

### 1. Supabase Configuration

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. React Query Configuration

Create `src/lib/queryClient.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})
```

### 3. TanStack Router Configuration

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4. Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 5. Update TypeScript Configuration

Update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

## Phase 4: Database Setup (Supabase)

### 1. Create Supabase Project
- Sign up/login to Supabase
- Create new project
- Copy project URL and anon key to `.env.local`

### 2. Database Schema Creation

Execute the SQL from `schema.dbml` in Supabase SQL editor:

- Categories table
- Subcategories table  
- Skills table
- Experiences table
- Education table
- Showcase_items table

### 3. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_items ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON showcase_items FOR SELECT USING (true);

-- Admin full access (replace with actual admin user ID)
CREATE POLICY "Admin full access" ON categories FOR ALL USING (auth.uid() = 'admin-user-id');
-- Repeat for all tables...
```

## Phase 5: Core Components Setup

### 1. Update Main App Component

Update `src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

### 2. Create Basic Route Structure

Create `src/routes/__root.tsx`:

```typescript
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/showcase" className="[&.active]:font-bold">
          Showcase
        </Link>
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

## Phase 6: Environment & Package Scripts Update

### Update package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## Phase 7: Initial Verification

### Development Server Test

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Verify the following:
# - Application loads without errors
# - React Query devtools are available
# - TanStack Router devtools are available
# - Basic routing works
# - Supabase connection is established
```

### Build Test

```bash
# Test production build
npm run build

# Preview production build
npm run preview
```

## Next Steps After Initial Setup

1. **Implement Authentication**: Set up Supabase Auth integration
2. **Create Base Components**: Implement core UI components using shadcn/ui
3. **Implement Data Fetching**: Create API service functions and React Query hooks
4. **Build Form Systems**: Implement universal form validation hooks
5. **Create Route Guards**: Implement authentication-based route protection
6. **Implement Core Features**: Start building Resume, Showcase, and Admin modules

## Common Issues & Troubleshooting

### Dependency Conflicts
- Ensure React versions are compatible across all packages
- Use `npm ls` to check for version conflicts

### TypeScript Errors
- Verify all type definitions are properly installed
- Check tsconfig paths are correctly configured

### Build Failures
- Ensure all imports are correctly typed
- Verify environment variables are properly configured

### Supabase Connection Issues
- Double-check environment variables
- Verify Supabase project settings
- Test connection with simple query

This setup guide provides the foundation for building the Interactive Resume application according to the patterns and architecture defined in the project documentation.