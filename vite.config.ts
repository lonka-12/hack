import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars starting with no prefix

  return {
    plugins: [react()],
    define: {
      'process.env': env // Expose all loaded env vars under process.env
    }
  };
})
