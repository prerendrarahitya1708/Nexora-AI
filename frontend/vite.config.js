import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat':     'http://127.0.0.1:5000',
      '/career':   'http://127.0.0.1:5000',
      '/skills':   'http://127.0.0.1:5000',
      '/roadmap':  'http://127.0.0.1:5000',
      '/interview':'http://127.0.0.1:5000',
      '/resume':   'http://127.0.0.1:5000',
    },
  },
})
