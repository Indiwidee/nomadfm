import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function buildBase(): string {
  const raw = process.env.BASE_PATH?.trim() || '/'
  const base = raw.startsWith('/') ? raw : `/${raw}`
  return base.endsWith('/') ? base : `${base}/`
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? buildBase() : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}))
