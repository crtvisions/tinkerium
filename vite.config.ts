import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'
import { globSync } from 'glob'
import fs from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Automatically find all .html files in the root and in tools subdirectories
const rootHtmlFiles = globSync('*.html', { cwd: __dirname })
const toolHtmlFiles = globSync('tools/**/index.html', { cwd: __dirname })

const htmlInputs = Object.fromEntries([
  ...rootHtmlFiles.map(file => [
    file.slice(0, -5),
    resolve(__dirname, file)
  ]),
  ...toolHtmlFiles.map(file => [
    file.replace('/index.html', '').replace(/\//g, '_'),
    resolve(__dirname, file)
  ])
])

// Polyfill for global object
const globalPolyfill = `
  var global = global || window || self || globalThis;
  if (!global.global) global.global = global;
`;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  const apiProxyTarget = env.VITE_API_PROXY_TARGET
  const serverPort = Number(env.PORT ?? 3000)

  return {
    plugins: [react(), devApiMiddleware()],
    server: {
      port: serverPort,
      strictPort: Boolean(env.PORT),
      proxy: apiProxyTarget
        ? {
            '/api': {
              target: apiProxyTarget,
              changeOrigin: true
            }
          }
        : undefined
    },
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'shared'),
      },
    },
    build: {
      rollupOptions: {
        input: htmlInputs,
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
  }
})

function devApiMiddleware() {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (!url || !url.startsWith('/api/')) {
          next()
          return
        }

        const parsedUrl = new URL(url, 'http://localhost')
        const route = parsedUrl.pathname.replace(/^\/api\//, '')
        const candidates = [
          `/api/${route}.ts`,
          `/api/${route}.js`,
          `/api/${route}/index.ts`,
          `/api/${route}/index.js`,
        ]

        let loaded: Record<string, unknown> | undefined
        for (const candidate of candidates) {
          const absolute = resolve(__dirname, candidate.slice(1))
          if (!fs.existsSync(absolute)) continue
          loaded = await server.ssrLoadModule(`${candidate}?dev=${Date.now()}`)
          break
        }

        if (!loaded || typeof loaded.default !== 'function') {
          res.statusCode = 404
          res.end('Not Found')
          return
        }

        const request: any = req
        if (!request.query) {
          request.query = Object.fromEntries(parsedUrl.searchParams.entries())
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          const chunks: Uint8Array[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const buffer = Buffer.concat(chunks)
          if (buffer.length > 0) {
            const raw = buffer.toString()
            request.rawBody = raw
            const contentType = req.headers['content-type'] ?? ''
            if (contentType.includes('application/json')) {
              try {
                request.body = JSON.parse(raw)
              } catch {
                request.body = raw
              }
            } else {
              request.body = raw
            }
          } else {
            request.body = undefined
          }
        }

        const response: any = res
        if (!response.status) {
          response.status = (code: number) => {
            res.statusCode = code
            return response
          }
        }
        if (!response.json) {
          response.json = (payload: unknown) => {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json')
            }
            res.end(JSON.stringify(payload))
            return response
          }
        }
        if (!response.send) {
          response.send = (payload: unknown) => {
            if (typeof payload === 'object' && payload !== null && !Buffer.isBuffer(payload)) {
              return response.json(payload)
            }
            res.end(payload as any)
            return response
          }
        }

        try {
          const handler = loaded.default as (request: any, response: any) => any
          const result = handler(request, response)
          if (result && typeof result.then === 'function') {
            await result
          }
        } catch (error) {
          console.error('API handler error:', error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.end('Internal Server Error')
          }
        }
      })
    },
  }
}