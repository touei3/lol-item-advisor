import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Electron の renderer（常時最前面ウィンドウのUI）用の Vite 設定。
// Web版(vite.config.ts)とは別物。エンジンは ../../src を共有する。
const rootDir = import.meta.dirname

export default defineConfig({
  root: resolve(rootDir, 'electron/renderer'),
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(rootDir, 'dist-electron/renderer'),
    emptyOutDir: true,
  },
  server: {
    port: 5180,
    // renderer から ../../src を import できるように許可
    fs: { allow: [rootDir] },
  },
})
