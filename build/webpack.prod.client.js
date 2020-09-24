const webpack = require('webpack');
const { merge } = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const { resolve, runtimeChunk, splitChunks } = require('./webpack.common');
const webpackBaseConfig = require('./webpack.base');
const VueSSRClientModifyPlugin = require('./plugin/VueSSRClientModifyPlugin');
const isProd = process.env.NODE_ENV === 'production';

const clientProdConfig = merge(webpackBaseConfig, {
  target: 'web',
  entry: {
    hello: resolve('src/pages/hello/index.ts')
    // TODO: 这里需要实现一个自动化方法生成多入口
  },
  output: {
    path: resolve('public/cdn'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.[chunkhash:8].js?cors=1',
    publicPath: '' // TODO: 这里需要按需填写
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      }
    }),
    // new VueSSRClientPlugin(), //TODO: 如果需要SSR则引入
    // new VueSSRClientModifyPlugin({
    //   outputPath: resolve(''),
    //   name: 'NovelReadClientManifest.conf', // TODO: 这里按需要修改
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
    }),
  ],
  optimization: {
    runtimeChunk,
    splitChunks,
  }
});

if (isProd) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  clientProdConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: /\.(css|js)/,
      threshold: 10240,
      minRatio: 0.8,
    })
  );
}
module.exports = clientProdConfig;