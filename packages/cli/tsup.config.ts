import { defineConfig } from 'tsup';


export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  minify: true,
  external: [
    '@lucidjs/core',
    '@lucidjs/web'
  ],
  banner: {
    js: '#!/usr/bin/env node',  // automatically inject the node shebang at the top of the compiled file
  },
});
