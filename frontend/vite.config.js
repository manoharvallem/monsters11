import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Run the dev server on port 3000
    proxy: {
      // Proxy API requests to the backend server
      // Any request to '/api' will be forwarded to 'http://localhost:5000/api'
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be false if the backend is not using HTTPS
      },
    },
  },
});
