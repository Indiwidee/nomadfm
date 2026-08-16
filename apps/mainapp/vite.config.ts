import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

function buildBase(): string {
  const raw = process.env.BASE_PATH?.trim() ?? ''
  const basePath = raw === '/' || raw === '' ? '' : raw.replace(/\/+$/, '')
  return `${basePath}/app/`
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? buildBase() : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}))
