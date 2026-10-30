import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Trois points d'entrée à noms fixes, référencés par public/manifest.json.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: 'popup.html',
        background: 'src/background.ts',
        content: 'src/content.ts',
        hook: 'src/hook.ts',
        sonar: 'src/sonar.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
