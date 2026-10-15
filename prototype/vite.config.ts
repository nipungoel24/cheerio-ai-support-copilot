import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' so the build works on any static host (Netlify, Vercel, GitHub Pages)
export default defineConfig({ plugins: [react()], base: './' })
