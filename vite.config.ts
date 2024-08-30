import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 可使用全局less变量
          hack: `true; @import (reference) "${path.resolve(__dirname, './src/assets/styles/mixin.less')}";`,
        },
        javascriptEnabled: true,
      },
    },
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]___[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // map '@' to './src'
    },
  },
  plugins: [react(), eslintPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 内网
        changeOrigin: true,
        // secure: false, // 忽略证书校验
        // rewrite: (path) => path.replace(/^\/digital_human_api/, ''),
      },
    },
  },
});
