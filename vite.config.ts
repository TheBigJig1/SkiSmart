import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias:
      {
        '@' : path.resolve(__dirname, "./src")
      },
  },
  server: {
    host: '0.0.0.0', // Allows connections from any IP
    port: 5173       // Specify the port if needed
  },
  publicDir: 'public', // Specify the public directory at the root level
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
