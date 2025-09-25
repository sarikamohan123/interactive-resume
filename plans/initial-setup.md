# Initial Setup Guide

This document outlines the initial setup steps required to transform the current Vite React TypeScript template into the Interactive Resume application using modern 2025 patterns.

## 📊 Implementation Progress Tracker

Track your setup progress with these checkboxes:

### Phase Completion Status
- [x] **Phase 1**: Core Dependencies Installation
- [x] **Phase 2**: Project Structure Setup
- [x] **Phase 3**: Configuration Setup
- [x] **Phase 4**: Database Setup (Supabase)
- [x] **Phase 5**: Core Components Setup
- [x] **Phase 6**: Package Scripts & Environment
- [x] **Phase 7**: Initial Verification
- [ ] **Phase 8**: Resume Module Implementation

### Quick Status Check
- [x] All dependencies installed successfully
- [x] Directory structure created
- [x] Configuration files updated
- [x] Build process working
- [x] Development server running (http://localhost:5175)
- [x] Database migration script ready
- [x] Auth bootstrap documented
- [x] Environment setup (.env.example)
- [x] Essential testing setup (Vitest e2e structure)
- [x] Package scripts (type-check, test) working
- [x] Build optimizations (no warnings)
- [x] Modern React 19 app with TanStack Router working
- [x] Error boundaries and loading states implemented
- [x] Development tools (React Query + Router devtools) working
- [x] Core routing structure complete
- [x] Supabase project connected (categories hook working)
- [x] RLS verified for all main tables (categories, subcategories, skills)
- [x] 404 route implemented
- [x] Resume route and components implemented
- [x] Date formatting utilities created
- [x] Section components with proper error handling
- [x] Navigation between routes working
- [ ] Full test suite implemented

## Phase 1: Core Dependencies Installation

### Install Required Packages

```bash
# Backend & Authentication (Latest 2025 versions)
npm install @supabase/supabase-js@latest

# Modern Routing (TanStack Router v2)
npm install @tanstack/react-router@latest
npm install -D @tanstack/router-devtools@latest @tanstack/router-vite-plugin@latest @tanstack/router-cli@latest

# State Management & API (React Query v5+)
npm install @tanstack/react-query@latest
npm install -D @tanstack/react-query-devtools@latest

# Data Tables (Modern TanStack Table)
npm install @tanstack/react-table@latest

# Form Management & Validation (2025 stable versions)
npm install react-hook-form@latest @hookform/resolvers@latest zod@latest

# Modern UI Components (shadcn/ui with latest CLI)
npx shadcn@latest init

# Modern bundling utilities
npm install -D vite-tsconfig-paths@latest

### Development Dependencies

```bash
# Additional TypeScript types for Node.js
npm install -D @types/node@latest

# Modern code formatting with Prettier v3+
npm install -D prettier@latest @ianvs/prettier-plugin-sort-imports@latest

# Modern Biome alternative (faster than ESLint+Prettier)
# npm install -D @biomejs/biome@latest

# Testing utilities (Vitest for modern testing)
npm install -D vitest@latest @vitest/ui@latest @testing-library/react@latest @testing-library/jest-dom@latest

# Modern build analysis
npm install -D vite-bundle-analyzer@latest
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

### 3. Modern Vite Configuration (2025)

Update `vite.config.ts` with modern patterns:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    // Modern React plugin with automatic JSX runtime
    react({
      // Enable React DevTools in development
      babel: {
        plugins: process.env.NODE_ENV === 'development' ? [['@babel/plugin-transform-react-jsx-development']] : [],
      },
    }),
    // TanStack Router with file-based routing
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
    }),
    // TypeScript path resolution
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Modern development server configuration
  server: {
    port: 5173,
    host: true, // Enable network access
    open: true, // Auto-open browser
  },
  // Modern build configuration
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Modern optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
  },
})
```

### 4. Modern Code Formatting Configuration

Create `.prettierrc.json` (Prettier v3+ format):

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "importOrder": [
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "",
    "^[./]"
  ],
  "importOrderTypeScriptVersion": "5.0.0"
}
```

Create `.prettierignore`:

```
dist
node_modules
*.gen.ts
routeTree.gen.ts
.env*
```

### 5. Modern TypeScript Configuration (2025)

Update `tsconfig.app.json` for modern patterns:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable", "WebWorker"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Enhanced linting for 2025 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": [
    "src",
    "vite.config.ts",
    "vitest.config.ts"
  ]
}
```

Add modern `vitest.config.ts` for testing:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
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

### 1. Modern Main App Component (2025)

Update `src/main.tsx` with modern patterns:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queryClient'

import './index.css'

// Create router with modern configuration
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register router for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Get root element with proper error handling
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Modern React 19 rendering with Concurrent Features
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  </StrictMode>
)
```

### 2. Modern Route Structure (2025)

Create `src/routes/__root.tsx` with modern patterns:

```typescript
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalLoading } from '@/components/global-loading'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => (
    <div className="p-4">
      <h1>Something went wrong!</h1>
      <pre>{error.message}</pre>
    </div>
  ),
})

function RootComponent() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Suspense fallback={<GlobalLoading />}>
          <Outlet />
        </Suspense>
        {import.meta.env.DEV && (
          <TanStackRouterDevtools position="bottom-left" />
        )}
      </div>
    </ErrorBoundary>
  )
}
```

Create modern index route `src/routes/index.tsx`:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import { ResumeLayout } from '@/components/layout/resume-layout'
import { ResumePage } from '@/pages/resume-page'

export const Route = createFileRoute('/')({n  component: RouteComponent,
  meta: () => [
    {
      title: 'Interactive Resume - Your Name',
      description: 'Modern interactive resume showcasing skills and experience',
    },
  ],
})

function RouteComponent() {
  return (
    <>
      <Helmet>
        <title>Interactive Resume - Your Name</title>
        <meta 
          name="description" 
          content="Modern interactive resume showcasing skills and experience" 
        />
      </Helmet>
      <ResumeLayout>
        <ResumePage />
      </ResumeLayout>
    </>
  )
}
```

## Phase 6: Modern Package Scripts (2025)

### Update package.json scripts with modern tooling

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md,json}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit",
    "routes:generate": "tsr generate",
    "routes:watch": "tsr watch",
    "analyze": "vite-bundle-analyzer",
    "clean": "rm -rf dist node_modules/.vite",
    "postinstall": "npm run routes:generate"
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

## ✅ Phase Verification Checklists

### Phase 1 Verification ✓
- [x] All npm packages installed without errors
- [x] No dependency conflicts reported
- [x] Package.json updated with new scripts
- [x] Node modules populated correctly

### Phase 2 Verification ✓
- [x] All directories created as specified
- [x] Folder structure matches the planned architecture
- [x] No missing subdirectories

### Phase 3 Verification ✓
- [x] Vite config updated with modern patterns
- [x] TypeScript config enhanced with 2025 settings (basic path mapping)
- [x] Prettier config created with import sorting
- [x] shadcn/ui initialized successfully
- [x] Tailwind CSS v3 configured with theme system
- [x] Build process runs without errors

### Phase 4 Verification ✓
- [x] Database migration script created (hardened auth trigger)
- [x] Environment configuration documented (.env.example)
- [x] Database schema implemented (complete ERD)
- [x] RLS policies configured (admin/public access)
- [x] Auth bootstrap process documented
- [x] Seed data script created
- [ ] Supabase project connected
- [ ] Connection test successful

### Phase 5 Verification ✓
- [x] Main.tsx updated with modern providers (React Query + TanStack Router)
- [x] Root route created with error boundaries and loading states
- [x] Basic routing structure implemented (index route working)
- [x] Development tools working (both devtools functional)
- [x] Error boundary component created (functional, modern)
- [x] Global loading component created
- [x] Router configuration with context working
- [x] No console errors, app fully functional

### Phase 6 Verification ✓
- [x] All package scripts added (lint, lint:fix, format, format:check, test:coverage, routes:generate, routes:watch, analyze, clean, postinstall)
- [x] Scripts execute without errors
- [x] Development workflow functional
- [x] ESLint issues resolved (button component React Fast Refresh)
- [x] Prettier formatting applied to all files
- [x] TypeScript compilation passes with no errors

### Phase 7 Verification ✓
- [x] Development server starts successfully (http://localhost:5173)
- [x] No console errors in browser (HMR working properly)
- [x] Production build completes (optimized chunks generated)
- [x] Production preview works (http://localhost:4174)
- [x] Environment variables injected correctly in production
- [x] All modern tools functioning (React Query + Router devtools)
- [x] 404 route added for proper error handling
- [x] RLS reads working for all tables (categories, subcategories, skills)
- [x] Supabase connection verified in both dev and production

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