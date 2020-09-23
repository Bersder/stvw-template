const { merge } = require('webpack-merge');
const webpack = require('webpack');
const webpackBaseConfig = require('./webpack.base');
const { resolve, runtimeChunk, splitChunks } = require('./webpack.common');
const devServer = require('./webpack.devServer');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(webpackBaseConfig, {
  target: 'web',
  entry: {
    hello: resolve('src/pages/hello/index.ts')
    // TODO: 这里需要实现一个自动化方法生成多入口
  },
  output: {
    path: resolve('public/dist'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
    publicPath: '' // TODO: 这里需要按需填写
  },
  optimization: {
    runtimeChunk,
    splitChunks,
  },
  plugins: [
    // new VueSSRClientPlugin(), //TODO: 如果需要SSR则引入
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
    })
  ],
  devServer
});
