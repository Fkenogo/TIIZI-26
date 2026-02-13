import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const devPort = Number(env.VITE_DEV_PORT || 3002);
    return {
      server: {
        port: devPort,
        strictPort: true,
        host: '127.0.0.1',
        hmr: {
          host: 'localhost',
          protocol: 'ws',
          port: devPort,
          clientPort: devPort,
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
