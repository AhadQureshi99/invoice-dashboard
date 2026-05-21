import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const fbrBase = env.VITE_FBR_BASE_URL || 'https://gw.fbr.gov.pk'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/fbr-api': {
          target: fbrBase,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/fbr-api/, ''),
        },
      },
    },
  }
})
