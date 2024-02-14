import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    vuetify(),
  ],
  base: 'https://jipaix.github.io/ari-ecoclean/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // if(id.endsWith('.css')) return '@css'
          // if(id.includes('vuetify')) return '@vuetify'
          // if(id.includes('@teckel')) return '@teckel'
          // if(id.includes('@xzing')) return '@xzing'
        }
      }
    }
  }
})
