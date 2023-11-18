import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    cors: true,
    https: { // .pem is outside of project for safety
      key: readFileSync('../../../localhost-key.pem', 'utf-8'),
      cert: readFileSync('../../../localhost.pem', 'utf-8')
    }
  }
})
