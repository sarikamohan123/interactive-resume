# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern interactive resume application built with React 19, TypeScript 5.8+, and Vite 7+ using 2025 best practices. It's currently in early development stage, starting from the default Vite React TypeScript template but will be transformed into a comprehensive portfolio application.

## Development Commands

### Core Development

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

### Modern Development Workflow (2025)

- **TypeScript compilation** integrated in build process with enhanced checking
- **Type checking** available via `npm run type-check` for development
- **Modern ESLint** with React 19 patterns and strict TypeScript rules
- **Prettier v3+** with import sorting and consistent formatting
- **Vitest** for fast unit and integration testing
- **TanStack Router CLI** for automatic route generation

## Project Structure

```
src/
├── main.tsx          # Application entry point with React 19 createRoot
├── App.tsx           # Main application component (currently default Vite template)
├── App.css           # Component-specific styles
├── index.css         # Global styles
├── vite-env.d.ts     # Vite type definitions
└── assets/           # Static assets (images, etc.)

public/
└── vite.svg          # Public assets served directly

```

## Technical Stack (2025)

### Core Framework
- **React 19** - Latest with Concurrent Features, useOptimistic, and React Compiler
- **TypeScript 5.8+** - Strict typing with enhanced project references
- **Vite 7+** - Modern build tool with optimized HMR and ESM support
- **ESLint 9** - Modern flat config with comprehensive TypeScript rules

### Key Dependencies (To be installed)
- **TanStack Router v2** - Type-safe file-based routing with modern patterns
- **TanStack Query v5** - Advanced server state management with real-time features
- **React Hook Form** - Performant forms with Zod validation
- **Supabase v2+** - Backend-as-a-Service with real-time capabilities
- **shadcn/ui** - Modern component library built on Radix UI
- **Vitest** - Fast testing framework replacing Jest
- **Tailwind CSS** - Utility-first styling (via shadcn/ui setup)

## Configuration Details

### TypeScript Configuration

- Uses project references (`tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`)
- Strict TypeScript configuration for both app and build tooling

### ESLint Configuration

- Modern flat config format (`eslint.config.js`)
- Configured for TypeScript and React with hooks
- Includes React refresh support for development
- Targets browser environment with ES2020

### Modern Vite Configuration (2025)

- **Advanced React plugin** with React 19 optimizations
- **TanStack Router integration** for file-based routing
- **TypeScript path resolution** with modern alias support
- **Optimized code splitting** with manual chunk configuration
- **Modern build targets** (ES2022) for better performance
- **Development optimizations** with enhanced HMR and auto-open

## Development Notes (2025)

- **Starting point**: Default Vite React TypeScript template
- **Target architecture**: Modern full-stack application with 2025 patterns
- **Testing strategy**: Vitest + Testing Library + Playwright for comprehensive coverage
- **UI framework**: shadcn/ui for modern, accessible components
- **State management**: TanStack Query for server state, React 19 hooks for client state
- **Form handling**: React Hook Form + Zod for type-safe validation
- **Authentication**: Supabase Auth with single admin user pattern
- **Real-time features**: Supabase subscriptions for live data updates

### Modern React 19 Features Used
- **Concurrent rendering** for better performance
- **useOptimistic** for optimistic UI updates
- **Suspense boundaries** for declarative loading states
- **React Compiler** for automatic memoization
- **Enhanced error boundaries** for robust error handling

## Data Model (ERD)

https://dbdiagram.io/d/Interactive-Resume-ERD-68be268261a46d388edeaaa9
DBML Source: ./plans/schema.dbml

## Architecture Documentation

- **Setup Guide**: `./plans/initial-setup.md` - Modern 2025 setup instructions with progress tracking
- **Architecture Patterns**: `./plans/patterns.md` - Comprehensive architectural guidance with implementation checklists
- **Project Information**: `./plans/agents.md` - Detailed project context for development

## 📊 Progress Tracking Guidance

### How to Use the Progress Trackers

1. **Phase-based Tracking** (`initial-setup.md`):
   - Check off completed phases as you implement them
   - Use verification checklists to ensure quality
   - Track both high-level phases and detailed verification steps

2. **Module-based Tracking** (`patterns.md`):
   - Monitor implementation of Resume, Showcase, and Admin modules
   - Track architectural component implementation
   - Use detailed checklists for comprehensive coverage

3. **Development Workflow**:
   - Always update progress tracking when completing tasks
   - Use checklists to ensure nothing is missed
   - Reference verification steps for quality assurance

### Progress Tracking Best Practices

- ✅ **Mark completed items** immediately after finishing
- 🔄 **Update status regularly** during development sessions  
- 🎯 **Focus on one checklist section** at a time
- 📝 **Document any deviations** from the planned approach
- 🧪 **Verify completeness** using the detailed checklists

### Quick Status Overview Locations

- **Setup Progress**: See top of `initial-setup.md`
- **Module Progress**: See top of `patterns.md`  
- **Detailed Checklists**: See bottom sections of both files
