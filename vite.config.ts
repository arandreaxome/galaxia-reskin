import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lexique } from './src/names';

// Points d'entrée à noms fixes, référencés par public/manifest.json.
// Le lexique du renommage est écrit dans rename.js (un script de contenu ne peut rien importer), en chaîne :
// un objet deviendrait une variable globale, partagée avec les autres scripts de contenu.
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { __LEXIQUE__: JSON.stringify(JSON.stringify(lexique())) },
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
        rename: 'src/rename.ts',
        topbar: 'src/topbar.ts',
        grades: 'src/grades.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
