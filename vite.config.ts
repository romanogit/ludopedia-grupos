import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    basicSsl(),
    react()
  ],
  build: {
    outDir: 'dist', // specify the output directory
    sourcemap: true, // generate source maps for easier debugging
    rollupOptions: {
      output: {
        // customize the output format and structure if needed
      }
    }
  }
});