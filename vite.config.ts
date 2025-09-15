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
