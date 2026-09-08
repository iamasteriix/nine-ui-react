import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';


/**
 * Vite config for library mode.
 * @see https://vitejs.dev/guide/build#library-mode
 */
export default defineConfig ({
  plugins: [
    react(),
    {
      ...viteStaticCopy({
        targets: [
          { src: 'assets/styles/fonts.css', dest: '.', },
          { src: 'assets/fonts/*', dest: '.', },
        ],
      }),
      apply: 'build',
    }
  ],

  server: {
    port: 3001,
  },

  build: {
    outDir: 'dist',
    
    /** Library entry — all public exports flow through here */
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LucidJS',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`, // outputs dist/index.es.js, dist/index.cjs.js
    },

    /** Peer deps — expected to exist in the consuming project */
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@lucidjs/web/assets/styles/fonts.css',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      }
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // convenience alias to the /path/to/src directory
    }
  }
});
