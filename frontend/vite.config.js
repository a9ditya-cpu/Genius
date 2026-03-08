import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow connections from Docker network
    port: 5173,
    proxy: {
      // Route all /api calls to the Flask backend (works in both Docker and locally)
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
      }
    }
  }
})

