import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  server: {
    watch: {
      usePolling: true, // ネットワークドライブでのファイル監視エラーを防止
    },
  },
})
