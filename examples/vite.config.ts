import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      'galacean-animator-controller': resolve(__dirname, '../dist/index.mjs'),
    },
  },
  server: {
    port: 3001,
  },
  root: __dirname,
  build: {
    outDir: 'dist',
  },
})