import esbuild from 'esbuild'

// Electron の main / preload を CJS にバンドル（../../src の共有コードも取り込む）
const common = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['electron'],
  sourcemap: false,
  logLevel: 'info',
}

// package.json が "type":"module" のため、CJS出力は .cjs 拡張子にする
await esbuild.build({
  ...common,
  entryPoints: ['electron/main/index.ts'],
  outfile: 'dist-electron/main/index.cjs',
})
await esbuild.build({
  ...common,
  entryPoints: ['electron/preload/index.ts'],
  outfile: 'dist-electron/preload/index.cjs',
})

console.log('✓ electron main/preload built → dist-electron/')
