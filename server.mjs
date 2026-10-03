import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.map': 'application/json', '.svg': 'image/svg+xml' }

createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url ?? '/').split('?')[0])
  const safePath = normalize(requestPath).replace(/^\.\.[\\/]/, '')
  let filePath = join(root, safePath === '/' ? 'index.html' : safePath)
  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) filePath = join(root, 'index.html')
  response.writeHead(200, { 'Content-Type': mime[extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' })
  response.end(readFileSync(filePath))
}).listen(4173, () => console.log('Cadenza preview: http://localhost:4173'))
