const { defineConfig } = require('@vue/cli-service');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/index.scss";`,
        //旧版本用prependData，新版比如cli5本用additionalData
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      fallback: { path: require.resolve('path-browserify') },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendor',
        cacheGroups: {
          'vue-router': {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]vue-router[\\/]/,
            chunks: 'all',
          },
          'element-plus': {
            name: 'element-plus',
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            priority: 40,
            chunks: 'all',
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
        },
      },
    },
  },
});
