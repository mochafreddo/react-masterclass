import * as path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3000 },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } },
  },
  css: { modules: { localsConvention: 'camelCaseOnly' } },
  optimizeDeps: { include: ['react', 'react-dom'] },
});
