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
            return 'content-script.js';
          }
          return 'assets/[name].js';
        },
      },
      input: {
        main: './popup.html',
        contentScript: './src/scripts/content-script.ts',
      },
    },
  },
});
