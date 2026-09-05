import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      ignored: [
        '**/Gallery/**',
        '**/legacy_vanilla/**',
        '**/Edit/**',
        '**/public/videos/**',
        '**/*.mp4',
        '**/*.mov',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.png',
        '**/*.gif',
        '**/*.webp',
        '**/*.~tmp',
        '**/*.tmp',
        '**/*.~*'
      ]
    }
  }
});
