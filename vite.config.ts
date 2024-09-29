import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
  plugins: [react(), basicSsl()],
  port: 5173,
  define: {
    'process.env': loadEnv(mode, './', ''),
  },
}})
