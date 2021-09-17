import path from 'path';
import { Plugin, UserConfig, HtmlTagDescriptor } from 'vite';
import fs from 'fs-extra';
import externalGlobals from 'rollup-plugin-external-globals';
import serveStatic from 'serve-static';
// 拷贝 https://github.com/nshen/vite-plugin-cesium.git
function vitePluginCesium(options = {
  rebuildCesium: false,
  devMinifyCesium: false
}) {
  const { rebuildCesium, devMinifyCesium } = options;

  const cesiumBuildRootPath = 'node_modules/cesium/Build';
  const cesiumBuildPath = 'node_modules/cesium/Build/Cesium/';
  const CESIUM_BASE_URL = '/cesium/';

  let publicPath = 'public';
  let outDir = 'dist';
  let base;
  let isBuild = false;

  return {
    name: 'vite-plugin-cesium',

    config(_, { command }) {
      const userConfig = {
        build: {
          assetsInlineLimit: 0,
          chunkSizeWarningLimit: 4000
        },
        define: {
          CESIUM_BASE_URL: JSON.stringify(CESIUM_BASE_URL)
        }
      };
      if (command === 'build' && !rebuildCesium) {
        userConfig.build.rollupOptions = {
          external: ['cesium'],
          plugins: [externalGlobals({ cesium: 'Cesium' })]
        };
      }

      return userConfig;
    },

    configResolved(resolvedConfig) {
      publicPath = resolvedConfig.publicDir;
      outDir = resolvedConfig.build.outDir;
      base = resolvedConfig.base;
      isBuild =
        resolvedConfig.isProduction || resolvedConfig.command === 'build';
    },

    configureServer({ middlewares }) {
      const cesiumPath = path.join(
        cesiumBuildRootPath,
        devMinifyCesium ? 'Cesium' : 'CesiumUnminified'
      );
      middlewares.use(CESIUM_BASE_URL, serveStatic(cesiumPath));
    },

    async closeBundle() {
      if (isBuild) {
        try {
          await fs.copy(
            path.join(cesiumBuildPath, 'Assets'),
            path.join(outDir, 'cesium/Assets')
          );
          await fs.copy(
            path.join(cesiumBuildPath, 'ThirdParty'),
            path.join(outDir, 'cesium/ThirdParty')
          );
          await fs.copy(
            path.join(cesiumBuildPath, 'Workers'),
            path.join(outDir, 'cesium/Workers')
          );
          await fs.copy(
            path.join(cesiumBuildPath, 'Widgets'),
            path.join(outDir, 'cesium/Widgets')
          );
          if (!rebuildCesium) {
            await fs.copy(
              path.join(cesiumBuildPath, 'Cesium.js'),
              path.join(outDir, 'cesium/Cesium.js')
            );
          }
        } catch (err) {
          console.error('copy failed', err);
        }
      }
    },

    transformIndexHtml() {
      const tags = [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: base + 'cesium/Widgets/widgets.css'
        }
      }];
      if (isBuild && !rebuildCesium) {
        tags.push({ tag: 'script', attrs: { src: base + 'cesium/Cesium.js' } });
      }
      return tags;
    }
  };
}

export default vitePluginCesium;