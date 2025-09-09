# Architecture Patterns & High-Level Plans

This document outlines the architectural patterns, design principles, and high-level implementation strategies for the Interactive Resume application.

## Core Architecture Pattern

### Client-Side Architecture
- **Single Page Application (SPA)** with React 19
- **Backend-as-a-Service (BaaS)** using Supabase
- **File-based routing** with TanStack Router
- **Component-driven development** with shadcn/ui

### Data Flow Pattern
```
User Interface → React Query → Supabase Client → Supabase Database
     ↑                                                    ↓
Form Validation ← Zod Schemas ← API Response ← Database Query
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

### Caching Strategy
- **React Query** for server state management
- **Stale-while-revalidate** for optimal UX
- **Optimistic updates** for admin operations
- **Background refetching** for data consistency

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

### Component Hierarchy
```
Pages (Route handlers)
├── Containers (Data fetching + business logic)
│   ├── Presentational Components (UI rendering)
│   │   ├── Base Components (shadcn/ui)
│   │   └── Custom Components (domain-specific)
│   └── Form Components (validation + submission)
└── Utility Components (shared across modules)
```

## Routing Architecture

### File-based Routing Structure
```
src/routes/
├── (resume)/              # Public resume routes
│   └── index.tsx          → ResumePage
├── showcase/              # Public showcase routes
│   ├── index.tsx          → ShowcaseListPage
│   └── [id]/index.tsx     → ShowcaseDetailPage
└── admin/                 # Protected admin routes
    ├── index.tsx          → AdminLoginPage
    ├── categories/        → CategoriesManagementPage
    ├── subcategories/     → SubcategoriesManagementPage
    └── skills/            → SkillsManagementPage
```

### Route Protection Pattern
```
Route Guard → Auth Check → Redirect Logic → Component Rendering
```

## Form Management Patterns

### Universal Form Hook Pattern
```typescript
// Custom hook combining all form utilities
const useEntityForm = <T>(schema: ZodSchema<T>, options: FormOptions) => {
  // Combines: zod + react-hook-form + @hookform/resolvers + react-query
  return {
    form: useForm(),
    validation: zodResolver(schema),
    mutation: useMutation(),
    handleSubmit: optimizedSubmitHandler
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

### Loading Patterns
- **Skeleton loading** for data fetching states
- **Progressive loading** for complex components
- **Lazy loading** for non-critical components
- **Prefetching** for anticipated user actions

### Optimization Patterns
- **React.memo** for expensive re-renders
- **useMemo/useCallback** for complex computations
- **Virtual scrolling** for large data sets (tables)
- **Image optimization** for showcase content

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

### Testing Strategy
- **Unit tests**: Utility functions and custom hooks
- **Integration tests**: Component + API interactions
- **E2E tests**: Critical user journeys
- **Visual regression tests**: UI consistency

### Test Organization
```
src/__tests__/
├── components/     # Component tests
├── hooks/          # Custom hook tests
├── utils/          # Utility function tests
└── integration/    # API integration tests
```

## Deployment & Environment Patterns

### Environment Configuration
- **Development**: Local Supabase + hot reloading
- **Staging**: Supabase staging + production build
- **Production**: Supabase production + optimized assets

### Build Optimization
- **Bundle analysis** for size optimization
- **Tree shaking** for unused code elimination
- **Asset optimization** for faster loading
- **CDN integration** for static assets

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

### Data Scalability
- **Database indexing** for query performance
- **Pagination** for large datasets
- **Caching strategies** for reduced API calls
- **Optimistic updates** for perceived performance