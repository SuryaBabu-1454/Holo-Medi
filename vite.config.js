import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  server: {
    host: true,  // This exposes the server to the local network
    port: 5173,  // Optional: specify the port if needed

  }


})
