# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive resume application built with React 19, TypeScript, and Vite. It's currently in early development stage, starting from the default Vite React TypeScript template.

## Development Commands

### Core Development

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

### Linting and Type Checking

- TypeScript compilation is part of the build process (`tsc -b && vite build`)
- No separate typecheck script is configured - use `npm run build` to verify types
- ESLint is configured with React hooks, React refresh, and TypeScript rules

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

## Technical Stack

- **React 19** - Latest React version with new createRoot API
- **TypeScript 5.8** - Strict typing with project references setup
- **Vite 7** - Modern build tool with fast HMR
- **ESLint 9** - Modern flat config with TypeScript and React rules

## Configuration Details

### TypeScript Configuration

- Uses project references (`tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`)
- Strict TypeScript configuration for both app and build tooling

### ESLint Configuration

- Modern flat config format (`eslint.config.js`)
- Configured for TypeScript and React with hooks
- Includes React refresh support for development
- Targets browser environment with ES2020

### Vite Configuration

- Standard React plugin setup
- No custom configuration beyond defaults

## Development Notes

- Currently using the default Vite React TypeScript template
- No testing framework is configured yet
- No additional UI libraries or frameworks are installed
- Uses React 19's latest patterns (createRoot, StrictMode)

## Data Model (ERD)

https://dbdiagram.io/d/Interactive-Resume-ERD-68be268261a46d388edeaaa9
DBML Source: ./plans/schema.dbml
