import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base は GitHub Pages 等のサブパス公開に備えて相対パスにしておく
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
