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
    ViteImageOptimizer({ jpg: { quality: 70 } }),
    ...(mode === 'development' ? [mkcert()] : [])
  ],
  base: 'https://jipaix.github.io/ari-ecoclean/',
  build: {
    minify: 'terser',
    terserOptions: { maxWorkers: 3 },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.endsWith('.css')) return '@css'
          if (id.includes('@teckel')) return '@teckel'
          if (id.includes('@xzing')) return '@xzing'
        }
      }
    }
  }
}))