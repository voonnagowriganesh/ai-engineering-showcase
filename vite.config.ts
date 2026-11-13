import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithms: ['gzip', 'brotliCompress'], threshold: 1024 }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split heavy third-party code into long-cached chunks so an edit to the
        // site never invalidates the three.js / motion bundles in the browser.
        // Rollup normalises module ids to forward slashes, including on Windows.
        manualChunks(id: string): string | undefined {
          const marker = '/node_modules/';
          const at = id.lastIndexOf(marker);
          if (at === -1) return undefined;

          const rest = id.slice(at + marker.length);
          const scoped = rest.startsWith('@');
          const packageName = scoped
            ? rest.split('/').slice(0, 2).join('/')
            : (rest.split('/')[0] ?? '');

          if (['react', 'react-dom', 'scheduler'].includes(packageName)) return 'vendor-react';
          if (packageName === 'three' || packageName.startsWith('@react-three')) {
            return 'vendor-three';
          }
          if (['motion', 'framer-motion', 'lenis'].includes(packageName)) {
            return 'vendor-motion';
          }
          if (['lucide-react', 'react-icons'].includes(packageName)) return 'vendor-icons';

          // Everything else is left to Rollup. A catch-all "vendor" chunk would
          // merge lazily-imported packages (cmdk) with eagerly-needed ones and
          // drag the whole thing into the initial page load.
          return undefined;
        },
      },
    },
  },
  server: { port: 5173, open: false },
});
