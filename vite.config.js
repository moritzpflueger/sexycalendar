import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import styleX from 'vite-plugin-stylex'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), styleX()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
