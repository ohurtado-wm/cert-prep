import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [tailwindcss(), vike()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
})
