# Architecture Patterns & High-Level Plans (2025)

This document outlines the modern architectural patterns, design principles, and high-level implementation strategies for the Interactive Resume application using 2025 best practices.

## 🎯 Implementation Roadmap

### Module Implementation Progress
- [x] **Resume Module** - Public resume data display (✅ Fully implemented with routing and error handling)
- [ ] **Showcase Module** - Portfolio with interactive demos
- [x] **Admin Module** - Authentication & CRUD system (✅ Complete: Categories, Subcategories, Skills, Certifications, Experiences, Education, Dashboard)

### Architecture Implementation Status
- [x] **Foundation Setup** - Dependencies, structure, configuration
- [x] **Database Architecture** - Schema, migrations, auth, RLS (Data populated with sarika-resume-data.sql)
- [x] **Client Architecture** - React 19 + Modern patterns (concurrent rendering)
- [x] **Basic Routing Setup** - Router provider and config working
- [x] **Error Handling** - Functional error boundaries with router integration
- [x] **Loading States** - Global loading components and Suspense boundaries
- [x] **Development Tools** - React Query + Router devtools integrated
- [x] **Authentication System** - Login, logout, password reset, protected routes (✅ Production-ready)
- [x] **Code Quality** - ESLint passing, console logs cleaned, React best practices
- [x] **Routing System** - File-based routing with TanStack Router (admin routes fully functional)
- [x] **Admin Routing** - Layout-based routing working (conflicting placeholder route removed)
- [x] **Data Flow** - TanStack Query + Supabase integration (All CRUD operations working)
- [x] **State Management** - Server/client state separation (React Query mutations)
- [x] **Component System** - shadcn/ui + custom components (Table, Dialog, Form, Input, Card, Select, Textarea)
- [x] **Form System** - Universal validation patterns (Zod + React Hook Form integrated)
- [x] **Toast Notifications** - sonner integrated for user feedback
- [x] **UI/UX Enhancements** - Sticky navigation, horizontal scroll fix, responsive design, professional page title, interactive tech badges, login polishing (✅ Phase 25 complete)
- [ ] **Testing Framework** - Vitest + Testing Library setup (basic config done)
- [ ] **Performance Optimization** - Modern React 19 features

## Core Architecture Pattern

### Modern Client-Side Architecture (2025)
- **Single Page Application (SPA)** with React 19 + Concurrent Features
- **Backend-as-a-Service (BaaS)** using Supabase v2+ with Real-time
- **File-based routing** with TanStack Router v2 (Type-safe routing)
- **Component-driven development** with shadcn/ui + Radix UI
- **Modern bundling** with Vite 7+ and optimized code splitting
- **Type-safe environment** with TypeScript 5.8+ strict mode

### Modern Data Flow Pattern (2025)
```
User Interface → TanStack Query v5 → Supabase Client v2 → Supabase Database
     ↑                    ↓                                        ↓
Zod Validation ← Type Safety ← API Response ← Row Level Security
     ↑                    ↓
React Hook Form ← Optimistic Updates
```

### State Management Flow (2025)
```
Server State (TanStack Query) ← Supabase Real-time
     ↓
Local State (React 19 hooks + useOptimistic)
     ↓
Form State (React Hook Form + Zod)
     ↓
UI State (CSS-in-JS + CSS Variables)
```

## Module Architecture

### 1. Resume Module (Public)
**Purpose**: Display resume data to recruiters and visitors
- **Pattern**: Read-only data presentation
- **Components**: Skills grid, experience timeline, education cards
- **Data Flow**: Supabase → React Query → UI components
- **Features**: Filtering, sorting, interactive skill categorization

### 2. Showcase Module (Public)
**Purpose**: Demonstrate advanced frontend solutions
- **Pattern**: Portfolio/gallery with detail views
- **Components**: Showcase grid, individual showcase applications
- **Data Flow**: Static + dynamic content rendering
- **Features**: Mini-applications embedded within showcase items

### 3. Admin Module (Private)
**Purpose**: Content management system for resume data
- **Pattern**: CRUD operations with form validation
- **Authentication**: Supabase Auth (single superuser)
- **Components**: Data tables, forms, management interfaces
- **Data Flow**: Forms → Validation → Supabase → Cache invalidation

## Data Management Patterns

### State Management Strategy
```
Global State (React Query) ← Server State
     ↓
Local State (React hooks) ← Component State
     ↓
Form State (React Hook Form) ← User Input
```

### Modern Caching Strategy (2025)
- **TanStack Query v5** with advanced caching patterns
- **Stale-while-revalidate** with intelligent background updates
- **React 19 useOptimistic** for immediate UI feedback
- **Real-time subscriptions** via Supabase for live data
- **Offline-first** with service worker caching
- **Smart prefetching** based on user navigation patterns

### Data Validation Pattern
```
Client Input → Zod Schema → React Hook Form → Supabase → Server Validation
```

## Component Architecture Patterns

### Composition Pattern
```
Layout Components
├── Header/Navigation
├── Main Content Area
│   ├── Module-specific layouts
│   └── Shared UI components
└── Footer
```

### Modern Component Hierarchy (2025)
```
Route Components (File-based routing)
├── Layout Components (Shared layouts with Suspense)
│   ├── Data Containers (Server state + React Query)
│   │   ├── UI Components (shadcn/ui + Radix)
│   │   │   ├── Compound Components (Composition patterns)
│   │   │   └── Primitive Components (Headless UI)
│   │   └── Form Components (React Hook Form + Zod)
│   └── Async Components (Lazy loading + Suspense)
└── Utility Components (Cross-cutting concerns)
```

## Routing Architecture

### Modern File-based Routing (TanStack Router v2)
```
src/routes/
├── __root.tsx                    # Root layout with providers
├── index.tsx                     # Resume homepage (/)
├── showcase/
│   ├── index.tsx                 # Showcase list (/showcase)
│   └── $id.tsx                   # Dynamic showcase detail (/showcase/$id)
├── admin/
│   ├── __layout.tsx              # Admin layout with auth guard
│   ├── index.tsx                 # Admin dashboard (/admin)
│   ├── categories/
│   │   ├── index.tsx             # Categories list (/admin/categories)
│   │   ├── $id.tsx               # Edit category (/admin/categories/$id)
│   │   └── new.tsx               # New category (/admin/categories/new)
│   ├── subcategories/
│   │   ├── index.tsx             # Subcategories management
│   │   └── $id.tsx               # Edit subcategory
│   └── skills/
│       ├── index.tsx             # Skills management
│       └── $id.tsx               # Edit skill
└── -components/                  # Route-level components (ignored by router)
```

### Route Protection Pattern
```
Route Guard → Auth Check → Redirect Logic → Component Rendering
```

## Form Management Patterns

### Modern Universal Form Hook (2025)
```typescript
// Modern form hook with React 19 features
const useEntityForm = <T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  options: FormOptions<T>
) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  
  const mutation = useMutation({
    mutationFn: options.mutationFn,
    onMutate: async (newData) => {
      // React 19 optimistic updates
      await queryClient.cancelQueries({ queryKey: options.queryKey })
      const previousData = queryClient.getQueryData(options.queryKey)
      queryClient.setQueryData(options.queryKey, newData)
      return { previousData }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(options.queryKey, context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    },
  })
  
  return {
    form,
    mutation,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit(mutation.mutate),
  }
}
```

### Form Component Pattern
```typescript
// Standardized form component structure
const EntityFormComponent = ({ hook, onSuccess, onError }) => {
  return (
    <Form>
      <FormFields />
      <FormActions />
      <FormStatus />
    </Form>
  )
}
```

## Database Interaction Patterns

### Query Patterns
- **List queries** with pagination and filtering
- **Detail queries** with related data loading
- **Search queries** with debouncing
- **Real-time subscriptions** for admin interfaces

### Mutation Patterns
- **Create**: Form validation → Optimistic update → Server sync
- **Update**: Partial updates with conflict resolution
- **Delete**: Confirmation → Optimistic removal → Server sync
- **Bulk operations**: Transaction-like behavior

## Authentication & Authorization

### Authentication Flow
```
User Login → Supabase Auth → JWT Token → Session Management → Route Access
```

### Authorization Pattern
- **Role-based**: Single superuser role for admin access
- **Route-level**: Protected admin routes
- **Component-level**: Conditional rendering based on auth state
- **API-level**: Row-level security in Supabase

## Performance Patterns

### Code Splitting Strategy
```
Route-level splitting → Module-level splitting → Component-level splitting
```

### Modern Loading Patterns (2025)
- **React 18+ Suspense** for declarative loading states
- **Skeleton UI** with CSS-driven animations
- **Progressive enhancement** with streaming SSR patterns
- **Smart code splitting** with dynamic imports
- **Intersection Observer** for lazy loading
- **Link prefetching** with TanStack Router
- **Resource hints** (preload, prefetch, preconnect)
- **Service Worker** for offline-first loading

### Modern Optimization Patterns (2025)
- **React 19 Compiler** (auto-memoization)
- **React.memo** only for proven performance bottlenecks
- **Virtual scrolling** with @tanstack/react-virtual
- **Image optimization** with modern formats (AVIF, WebP)
- **Bundle analysis** with vite-bundle-analyzer
- **Tree shaking** with modern ESM imports
- **Critical CSS** extraction for above-the-fold content
- **Web Workers** for heavy computations
- **Concurrent rendering** with React 19 features

## Error Handling Patterns

### Error Boundary Strategy
```
Global Error Boundary → Module Error Boundaries → Component Error Handling
```

### Error Types & Handling
- **Network errors**: Retry mechanisms with backoff
- **Validation errors**: Form-level error display
- **Auth errors**: Redirect to login
- **Not found errors**: 404 pages with navigation options
- **Server errors**: User-friendly error messages with support contact

## Testing Patterns

### Modern Testing Strategy (2025)
- **Vitest** for fast unit and integration tests
- **Testing Library** with modern React 19 patterns
- **MSW v2** for API mocking
- **Playwright** for E2E testing
- **Chromatic** for visual regression testing
- **React Testing Library** with Suspense testing
- **Component testing** with Storybook 8+
- **Performance testing** with Web Vitals
- **Accessibility testing** with axe-core

### Modern Test Organization (2025)
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── button.test.tsx        # Co-located tests
│   └── forms/
│       ├── user-form.tsx
│       └── user-form.test.tsx
├── hooks/
│   ├── use-skills.ts
│   └── use-skills.test.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── test/
    ├── setup.ts                   # Test setup
    ├── mocks/                     # MSW handlers
    ├── fixtures/                  # Test data
    └── utils/                     # Test utilities

e2e/
├── specs/
│   ├── resume.spec.ts
│   └── admin.spec.ts
└── fixtures/                      # E2E test data
```

## Deployment & Environment Patterns

### Environment Configuration
- **Development**: Local Supabase + hot reloading
- **Staging**: Supabase staging + production build
- **Production**: Supabase production + optimized assets

### Modern Build Optimization (2025)
- **Vite 7+ optimizations** with native ESM
- **Advanced code splitting** with manual chunks
- **Modern asset optimization** (AVIF, WebP, SVG compression)
- **CSS optimization** with Lightning CSS
- **JavaScript minification** with SWC
- **Bundle analysis** with detailed dependency tracking
- **Edge deployment** optimization for Vercel/Netlify
- **Progressive Web App** features with Workbox

## Security Patterns

### Data Security
- **Input sanitization** via Zod schemas
- **SQL injection prevention** via Supabase client
- **XSS prevention** via React's built-in protections
- **CSRF protection** via SameSite cookies

### Authentication Security
- **JWT token management** with automatic refresh
- **Session timeout** handling
- **Secure cookie handling** for auth state
- **Password requirements** enforcement

## Scalability Considerations

### Code Scalability
- **Modular architecture** for easy feature addition
- **Standardized patterns** for consistent development
- **Reusable components** for DRY principles
- **Type safety** for maintainable code

### Modern Data Scalability (2025)
- **Supabase indexing** with EXPLAIN ANALYZE optimization
- **Cursor-based pagination** for infinite scrolling
- **Smart caching** with TanStack Query v5 features
- **Real-time optimistic updates** with conflict resolution
- **Database connection pooling** via Supabase
- **Edge functions** for data processing
- **Vector search** for advanced filtering (if needed)
- **Background sync** for offline data management

## 📋 Implementation Checklists

### Resume Module Checklist
- [x] **Data Models**: Categories, Skills, Experience, Education types
- [x] **API Integration**: Supabase queries and real-time subscriptions
- [x] **Components**: Skill cards, experience timeline, education sections
- [x] **Error Handling**: Loading states, empty states, error boundaries
- [x] **Date Formatting**: Utility functions with "Present" handling
- [x] **Accessibility**: ARIA attributes, semantic HTML, proper heading hierarchy
- [x] **Defensive Programming**: Array safety, null checks, type guards
- [x] **Route Integration**: File-based routing with navigation
- [x] **Core Functionality**: Complete resume display with all sections working
- [x] **Landing Page**: Professional hero section with feature cards and tech stack badges
- [x] **Anchor Navigation**: Hash-based navigation to specific resume sections (#skills, #experience, #education)
- [x] **Smooth Scrolling**: Global smooth scroll behavior for polished UX
- [x] **Template Cleanup**: Removed unused Vite template files (App.tsx, App.css) and conflicting CSS
- [x] **Professional Branding**: Real name (Sarika Srivastava) and recruiter-optimized tagline
- [x] **Consistent Identity**: Logo and brand name updated across all pages (SS initials)
- [x] **UI/UX Refinements**: Clean gradients, fixed sticky nav, unified blue→purple theme, smooth badge hovers
- [x] **Scroll Animations**: useScrollAnimation hook for section fade-in effects
- [x] **Navigation Components**: BackToTop button and StickyResumeNav with smooth scrolling
- [x] **Performance Fix**: Removed authReady dependency for instant resume page loading
- [ ] **Filtering**: Category-based filtering and search functionality
- [ ] **Responsive Design**: Mobile-first responsive layouts (basic styling done)
- [ ] **Performance**: Virtualization for large skill lists
- [ ] **SEO**: Meta tags and structured data

### Showcase Module Checklist  
- [ ] **Portfolio Items**: Dynamic showcase content loading
- [ ] **Interactive Demos**: Embedded mini-applications
- [ ] **Media Management**: Image optimization and lazy loading
- [ ] **Navigation**: Smooth transitions between showcase items
- [ ] **Code Examples**: Syntax highlighting and copy functionality
- [ ] **Performance**: Code splitting for showcase demos
- [ ] **Analytics**: User interaction tracking

### Admin Module Checklist
- [x] **Authentication**: Supabase Auth with single admin user
- [x] **Admin Layout**: Navigation tabs with protected routes
- [x] **Database Types**: Comprehensive types for all tables (Row, Insert, Update)
- [x] **Validation Schemas**: Zod schemas for Categories and Subcategories
- [x] **Toast Notifications**: sonner integration for user feedback
- [x] **Categories CRUD**: Complete create, read, update, delete
- [x] **Form Validation**: React Hook Form + Zod integration
- [x] **Data Tables**: Categories table with actions
- [x] **Mutation Hooks**: useCategoryMutations with TanStack Query
- [x] **Subcategories CRUD**: Complete create, read, update, delete operations
- [x] **Subcategory Mutations**: useSubcategoryMutations with skill validation
- [x] **Subcategories Page**: Full CRUD UI with category selector, validation warnings
- [x] **Skills Schema**: Zod validation for name, level, years, description, links, sort_order
- [x] **Skills Mutations**: useSkillMutations hook with TanStack Query
- [x] **Skills CRUD Page**: Complete admin interface with subcategory selector, optional fields
- [x] **Certifications Schema**: Zod validation for name, issuing_organization, issued_at, credential_id, credential_url, sort_order
- [x] **Certifications Mutations**: useCertificationMutations hook with TanStack Query
- [x] **Certifications CRUD Page**: Complete admin interface for managing professional certifications
- [x] **Experiences CRUD**: Complete CRUD for work experiences with date handling
- [x] **Education CRUD**: Complete CRUD for education with date handling
- [x] **Admin Dashboard**: Stats summary with entity counts, recent items, and quick action buttons (including Certifications)
- [x] **Admin Routing Fix**: Removed conflicting placeholder route, all CRUD pages accessible
- [x] **Navigation Working**: All admin tabs (Dashboard, Categories, Subcategories, Skills, Certifications, Experiences, Education) functional
- [x] **RLS Verification**: admin-verification.sql script created for testing admin access
- [ ] **File Upload**: Media management for showcase items
- [ ] **Real-time Updates**: Live data synchronization (optional)
- [x] **Error Handling**: Comprehensive error boundaries
- [x] **Security**: Row-level security and input validation

### Technical Infrastructure Checklist
- [x] **Build System**: Vite 7+ with optimized configuration
- [x] **Type Safety**: Full TypeScript coverage with strict mode
- [x] **Linting & Formatting**: ESLint 9 + Prettier v3+ with import sorting
- [ ] **Testing**: Unit, integration, and E2E test suites (setup done, tests pending)
- [ ] **Performance**: Web Vitals monitoring and optimization
- [ ] **Security**: Content Security Policy and HTTPS
- [ ] **Deployment**: CI/CD pipeline with automated testing
- [ ] **Monitoring**: Error tracking and performance metrics
- [ ] **Documentation**: API docs and component documentation