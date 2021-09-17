import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'

// import vitePluginCesium from 'vite-plugin-cesium';
import vitePluginCesium from "./src/api/configs/vitePluginCesium.js";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log('环境配置:', mode)

  // console.log('环境配置:', mode)
  showEvnInfo()

  return defineConfig({
    plugins: [
      vue(),
      vitePluginCesium(),

    ],
    define: {

      // 'process.env': {}
    },
    server: {
      port: process.env.VITE_PORT,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    }

    /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ]
    },
    */
  })

}

function showEvnInfo() {
  console.log('打包配置')
  console.log(process.env.NODE_ENV)
  console.log(process.env.VUE_APP_Cesium)
}