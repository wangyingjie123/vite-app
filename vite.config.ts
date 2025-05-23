import { defineConfig, loadEnv } from 'vite';

import { createVitePlugins } from './build/plugins';
import { handleEnv } from './build/utils/helper';
import { buildOptions } from './build/vite/build';
import { createProxy } from './build/vite/proxy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = handleEnv(env);
  const { VITE_SERVER_PORT, VITE_PROXY } = viteEnv;

  return {
    plugins: createVitePlugins(),
    base: './',
    resolve: {
      alias: {
        '@': '/src',
        '#': '/types',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          charset: false,
        },
      },
    },
    server: {
      open: true,
      port: VITE_SERVER_PORT,
      // 跨域处理
      proxy: createProxy(VITE_PROXY),
    },
    build: buildOptions(),
  };
});
