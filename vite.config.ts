// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    ViteImageOptimizer({ jpg: { quality: 60 }, png: { quality: 60 } }),
    ...(mode === 'development' ? [mkcert()] : [])
  ],
  base: 'https://jipaix.github.io/ari-ecoclean/',
  build: {
    minify: 'terser',
    terserOptions: { maxWorkers: 3, compress: { passes: 2 }, mangle: true },
    sourcemap: mode === 'development',
    assetsInlineLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor_vue'
          }
          if (id.endsWith('.css')) return '@css'
        }
      }
    }
  }
}))