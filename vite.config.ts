
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 關鍵：確保資源路徑正確
  build: {
    minify: 'terser',
    // Fix: Using 'as any' to bypass the type error while preserving the intended terser configuration
    terserOptions: {
      compress: {
        drop_console: true,
      },
    } as any,
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.FIREBASE_CONFIG': JSON.stringify(process.env.FIREBASE_CONFIG || ''),
  },
});
