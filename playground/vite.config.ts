import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@galacean/editor-ui': path.resolve(__dirname, '../editor-ui/packages/ui/src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['@galacean/animator-controller-editor'],
  },
  build: {
    sourcemap: true,
  },
})
