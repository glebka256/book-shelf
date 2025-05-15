const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  devServer: {
    port: 8081,
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@book-shelf/component-lib': path.resolve(__dirname, '../../component-lib/src')
      }
    }
  }
})