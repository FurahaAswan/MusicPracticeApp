import { build } from 'esbuild'
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist/assets', { recursive: true })

await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'dist/assets',
  format: 'esm',
  jsx: 'automatic',
  minify: true,
  sourcemap: true,
  loader: { '.ts': 'ts', '.tsx': 'tsx', '.css': 'css' },
  legalComments: 'none',
})

const html = readFileSync('index.html', 'utf8')
  .replace('/src/main.tsx', '/assets/main.js')
  .replace('</head>', '  <link rel="stylesheet" href="/assets/main.css" />\n  </head>')
writeFileSync('dist/index.html', html)
copyFileSync('dist/index.html', 'dist/404.html')
console.log('Cadenza build written to dist/')
