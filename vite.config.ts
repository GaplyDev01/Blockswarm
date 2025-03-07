import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Prevent base64 inlining for assets
  build: {
    assetsInlineLimit: 0,
  },
  // Ensure proper file serving
  server: {
    fs: {
      strict: false,
    },
  },
  // Explicitly set public directory
  publicDir: 'public',
});