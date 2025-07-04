const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  publicPath: '/',
  devServer: {
    port: 8081,
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@book-shelf/component-lib': path.resolve(__dirname, '../../component-lib/src')
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(false)
  }
})