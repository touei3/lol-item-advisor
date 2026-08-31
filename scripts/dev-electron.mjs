import { spawn } from 'node:child_process'
import esbuild from 'esbuild'
import electron from 'electron'

// 開発用: renderer を Vite devサーバで、main/preload を esbuild watch で、
// そろったら Electron を起動する。
const RENDERER_URL = 'http://localhost:5180'

const common = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['electron'],
  sourcemap: true,
  logLevel: 'info',
}

const mainCtx = await esbuild.context({
  ...common,
  entryPoints: ['electron/main/index.ts'],
  outfile: 'dist-electron/main/index.js',
})
const preloadCtx = await esbuild.context({
  ...common,
  entryPoints: ['electron/preload/index.ts'],
  outfile: 'dist-electron/preload/index.js',
})
await mainCtx.watch()
await preloadCtx.watch()

// Vite devサーバ（renderer）
const vite = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', '-c', 'vite.electron.config.ts'],
  { stdio: 'inherit', shell: process.platform === 'win32' },
)

// Vite の起動を少し待ってから Electron 起動
await new Promise((r) => setTimeout(r, 2500))

const child = spawn(electron, ['.'], {
  stdio: 'inherit',
  env: { ...process.env, ELECTRON_RENDERER_URL: RENDERER_URL },
})

const shutdown = () => {
  child.kill()
  vite.kill()
  mainCtx.dispose()
  preloadCtx.dispose()
  process.exit(0)
}
child.on('close', shutdown)
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
