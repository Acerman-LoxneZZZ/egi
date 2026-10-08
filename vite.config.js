import { defineConfig } from 'vite';
export default defineConfig({
  server: { watch: { usePolling: process.platform === 'win32', interval: 400, binaryInterval: 1000, ignored: ['**/.impeccable/**', '**/assets/plates/**', '**/dist/**', '**/ref/**'] } },
  build: { rollupOptions: { output: { manualChunks(id) { if (id.includes('/node_modules/three/')) return 'three'; } } } },
});
