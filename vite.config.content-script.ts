import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: false,
    minify: false,
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
        contentScript: './src/scripts/content-script.ts',
      },
    },
  },
});
