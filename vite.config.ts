import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'
import { globSync } from 'glob'

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

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Runs the server on localhost:3000
    // Proxy object removed
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Add any other necessary aliases here
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
})