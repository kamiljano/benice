import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          throw new Error('Unknown chunk name');
        },
      },
      input: {
        background: './src/background/background.ts',
      },
    },
  },
});
