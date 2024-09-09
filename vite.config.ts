import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'contentScript') {
            return 'assets/content-script.js';
          }
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name].js';
        },
      },
      input: {
        main: './popup.html',
        contentScript: './src/scripts/content-script.ts',
        background: './src/background/background.ts',
      },
    },
  },
});
