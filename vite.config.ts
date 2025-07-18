// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import './vite-crypto-fix' // Keep this first

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './node_modules')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },

  optimizeDeps: {
    include: [
      'vue',
      'pinia',
      'vue-router',
      '@vueuse/core'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      target: 'es2020'
    }
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: false
  },

  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['lodash', 'axios']
        }
      }
    }
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
})