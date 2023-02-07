import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

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
  plugins: [react(), eslintPlugin()],
});
