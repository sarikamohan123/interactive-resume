# Interactive Resume Application

A modern, interactive resume application built with React 19 and cutting-edge 2025 web development patterns. This application demonstrates advanced frontend engineering skills through an interactive portfolio that goes beyond traditional static resumes.

## 🎯 Project Purpose

This application serves as a dynamic showcase for recruiters and hiring managers, providing:
- **Interactive data visualization** of skills, experience, and education
- **Advanced filtering and sorting** capabilities for resume data
- **Live portfolio demonstrations** of complex UX/UI solutions
- **Real-time content management** for keeping information current

## 🏗️ Architecture Overview

### Three Core Modules

#### 📄 Resume Module (Public)
- Dynamic display of categorized skills with proficiency levels
- Interactive timeline of professional experience
- Filterable education and certification records
- Real-time data updates from Supabase backend

#### 🚀 Showcase Module (Public) 
- Portfolio of advanced frontend solutions
- Embedded mini-applications demonstrating UX/UI problem-solving
- Interactive code examples and technical explanations
- Performance-optimized media galleries

#### ⚙️ Admin Module (Private)
- Single-user authentication for content management
- CRUD operations for all resume data entities
- Real-time content updates with optimistic UI feedback
- Advanced form validation and error handling

## 💻 Modern Tech Stack (2025)

### Core Framework
- **React 19** - Concurrent Features, useOptimistic, React Compiler
- **TypeScript 5.8+** - Strict typing with enhanced project references
- **Vite 7+** - Modern build tooling with optimized development experience

### Key Dependencies
- **TanStack Router v2** - Type-safe file-based routing
- **TanStack Query v5** - Advanced server state management with real-time features
- **Supabase v2+** - Backend-as-a-Service with real-time database subscriptions
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **shadcn/ui** - Modern component library built on Radix UI
- **Vitest** - Fast testing framework for modern applications

## 🗄️ Data Model

The application manages structured resume data through Supabase with the following entities:
- **Categories** → **Subcategories** → **Skills** (hierarchical skill organization)
- **Experiences** (professional work history with detailed descriptions)
- **Education** (academic background and certifications)
- **Showcase Items** (portfolio projects with interactive demonstrations)

**Database Schema**: [View ERD](https://dbdiagram.io/d/Interactive-Resume-ERD-68be268261a46d388edeaaa9)

## 🚀 Getting Started

### Quick Start (Setup Complete)

```bash
# Clone and install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Visit: http://localhost:5173
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint with strict rules
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # TypeScript compilation check

# Testing
npm run test            # Run tests with Vitest
npm run test:ui         # Vitest UI interface
npm run test:run        # Run tests once
npm run test:coverage   # Test coverage report

# TanStack Router
npm run routes:generate # Generate route tree
npm run routes:watch    # Watch route changes

# Analysis & Utilities
npm run analyze         # Bundle size analysis
npm run clean          # Clean build artifacts
```

### Environment Setup

1. **Supabase Configuration**:
   ```bash
   # .env.local
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Route Generation**:
   - Routes auto-generate from `src/routes/` structure
   - Run `npm run routes:generate` after adding new routes
   - Post-install hook automatically generates routes

3. **Documentation**:
   - `./plans/initial-setup.md` - Complete setup guide (✅ Phase 1-7 complete)
   - `./plans/patterns.md` - Architecture patterns and implementation
   - `./CLAUDE.md` - Development workflow and commands

## 🔐 Auth Bootstrap

After setting up the Supabase database and running the migration:

1. **Create User Account**:
   - Sign up through the Supabase dashboard or app signup flow
   - Verify the `profiles` table row was automatically created

2. **Grant Admin Access** (one-time setup):
   ```sql
   UPDATE public.profiles
   SET is_admin = true
   WHERE id = (SELECT id FROM auth.users WHERE email = '<YOUR_EMAIL>');
   ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env.local`
   - Set your Supabase URL and anon key
   - Configure Site URL in Supabase: `http://localhost:5175`
   - Set Redirect URLs: `http://localhost:5175/*`

## 🎨 Key Features

### For Recruiters & Viewers
- **Interactive Skills Matrix**: Filter and explore technical capabilities
- **Dynamic Experience Timeline**: Drill down into role details and achievements
- **Live Portfolio Demos**: Experience actual applications, not just screenshots
- **Responsive Design**: Optimal viewing on all devices

### For Content Management
- **Real-time Updates**: Changes reflect immediately without deployment
- **Rich Content Support**: Media uploads, formatted descriptions, and links
- **Data Relationships**: Manage hierarchical skill categorization
- **Performance Monitoring**: Track portfolio engagement and performance

## 🔧 Development Philosophy

This project demonstrates mastery of:
- **Modern React Patterns**: Concurrent rendering, optimistic updates, advanced hooks
- **Type Safety**: Comprehensive TypeScript usage with strict configurations
- **Performance**: Code splitting, lazy loading, optimistic UI patterns
- **User Experience**: Smooth interactions, loading states, error boundaries
- **Architecture**: Clean separation of concerns, reusable patterns, scalable structure

## 📊 Progress Tracking

The project includes comprehensive progress tracking across all planning documents:
- ✅ **Setup Progress**: Phase-by-phase implementation tracking
- 🎯 **Module Progress**: Feature-level completion monitoring  
- 📋 **Quality Checklists**: Verification steps for each component

## 🤝 Single-User Application

This application is designed for single-user content management, representing one individual's professional profile. The admin authentication supports one superuser who can manage all content through the integrated CMS.

---

*Built with modern 2025 web development patterns to showcase advanced frontend engineering capabilities.*