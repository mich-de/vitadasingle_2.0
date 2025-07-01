import { defineConfig } from 'vite'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
    // Forza il refresh quando ci sono cambiamenti
    hmr: {
      overlay: true
    }
  },
  // Ottimizzazioni per evitare problemi di import
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
})
