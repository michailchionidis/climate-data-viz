import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Disable sourcemaps in production build to avoid noisy Chakra UI sourcemap warnings
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules/', 'e2e/', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        'coverage/',
        'vite.config.ts',
        'playwright.config.ts',
        'src/vite-env.d.ts',
        'src/main.tsx',
      ],
      // Don't clean the coverage directory (important for Docker volume mounts)
      clean: false,
    },
  },
})
