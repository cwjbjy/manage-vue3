const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  configureWebpack: {
    plugins: [],
    resolve: {
      fallback: { path: require.resolve('path-browserify') },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/index.scss";`,
        //旧版本用prependData，新版比如cli5本用additionalData
      },
    },
  },
});
