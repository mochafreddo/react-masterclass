import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Ensure this matches your deployment setup
  },
  server: {
    historyApiFallback: true, // SPA 라우팅을 지원하도록 설정
  },
});
