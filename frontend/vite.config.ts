import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
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
