## Project Context

The purpose of this application is to give recruiters more insight into my skills as a
frontend software engineer. A static resume only has one "state". With an application,
We can make use of things like filtering, sorting, and data-relation.

## Coding Standards & Style (2025)

- **Formatting:** Always format code using Prettier v3+ with import sorting.
- **Naming Conventions:** Follow modern React 19 and TypeScript 5.8+ conventions.
- **Code Quality:** Use ESLint 9 with strict TypeScript rules and React hooks patterns.
- **Testing:** Write tests using Vitest and Testing Library for all components and hooks.

## Architecture Notes (2025)

We will be using the Supabase v2+ SDK on the client with modern patterns, eliminating the need for a custom backend. Authentication will use Supabase Auth with enhanced security features for single admin user access. The application will leverage React 19's concurrent features and modern state management patterns.

## Data Model (ERD)

https://dbdiagram.io/d/Interactive-Resume-ERD-68be268261a46d388edeaaa9
DBML Source: ./plans/schema.dbml

## Modern Routing Structure (2025)

We will use TanStack Router v2 with modern file-based routing patterns:

https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing

URL structure with modern routing conventions:

```
|__/ # Resume Page (index.tsx)
|
|__/showcase # Showcase Directory
| |__/ # Showcase List Page (showcase/index.tsx)
| |__/$id # Dynamic Showcase Detail ($id.tsx) - Mini applications demonstrating solutions
|
|__/admin # Admin Directory
| |__/ # Login Page (guarded when user is logged in)
| |__/categories # Edit Categories Page
| |__/subcategories # Edit Subcategories Page
| |__/skills # Skill Page
```

## Modules

- Resume - Module for publicly displaying resume data
- Showcase - Module for publicly displaying solutions to tough UX/UI problems
- Admin - Module for editing resume data. Will only be accessible by one user (superuser)

## Modern Application Dependencies (2025)

Built with modern Vite 7+ and React 19 patterns.

Core libraries with 2025 versions:

- `@supabase/supabase-js@latest` - Modern Backend-as-a-Service with real-time features
- `@tanstack/react-router@latest` - Type-safe file-based routing (v2)
- `@tanstack/react-query@latest` - Advanced server state management (v5+)
- `@tanstack/react-table@latest` - Modern data table rendering with virtualization
- `zod@latest` - TypeScript-first schema validation
- `react-hook-form@latest` - Performant forms with minimal re-renders
- `@hookform/resolvers@latest` - Zod integration for React Hook Form
- `shadcn/ui` - Modern component library built on Radix UI and Tailwind
- `vitest@latest` - Fast testing framework replacing Jest

## Module Patterns

Below are some patterns we would like to follow to keep things simple and consitent

### Admin Patterns

#### Modern Form Validation (2025)

All forms use a standardized validation mechanism combining modern React 19 patterns. The global custom hook integrates `zod`, `@hookform/resolvers`, `react-hook-form`, and `@tanstack/react-query` with React 19's `useOptimistic` for immediate UI feedback.

Each entity has a separate validation schema with TypeScript inference.

Modern mechanism pattern:

1. **Universal Form Hook**: Combines validation, mutation, and optimistic updates
2. **Type-safe Form Component**: Accepts the hook instance with full TypeScript support
3. **Optimistic Updates**: Uses React 19's `useOptimistic` for immediate feedback
4. **Error Boundaries**: Graceful error handling with user-friendly messages

### Modern Routing Patterns (2025)

All routes use TanStack Router v2 patterns with clear separation of concerns:

1. **Route Files**: Handle routing logic, type safety, and data loading
2. **Page Components**: Contain presentation logic and component composition
3. **Layout Components**: Provide shared layouts with Suspense boundaries
4. **Error Boundaries**: Handle route-level error states

Modern file structure examples:

- `src/routes/index.tsx` - Route definition with loaders
- `src/pages/resume-page.tsx` - Page component with business logic
- `src/components/layout/resume-layout.tsx` - Layout with error boundaries

Each route leverages modern features:

- **Type-safe navigation** with TanStack Router
- **Suspense boundaries** for loading states
- **Error boundaries** for graceful error handling
- **Prefetching** for optimized performance
