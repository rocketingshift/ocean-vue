import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  // Tên repo GitHub của bạn — đổi 'ocean-vue' nếu đặt tên khác
  base: '/ocean-vue/',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  server: {
    host: true,
    port: 3000,
  },

  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three:  ['three'],
          gsap:   ['gsap'],
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
