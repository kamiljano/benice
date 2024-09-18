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
        {
          src: 'node_modules/tippy.js/dist/tippy.css',
          dest: 'assets',
        },
        {
          src: 'src/assets/*',
          dest: 'assets',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: () => {
          return 'assets/main.js';
        },
      },
      input: {
        main: './popup.html',
      },
    },
  },
});
