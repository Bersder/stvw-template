const webpack = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const { resolve } = require('./webpack.common');
const webpackBaseConfig = require('./webpack.base');
const VueSSRServerModifyPlugin = require('./plugin/VueSSRServerModifyPlugin');
const isProd = process.env.NODE_ENV === 'production';

const serverProdConfig  = merge(webpackBaseConfig, {
  target: 'node',
  devtool: '#source-map',
  entry: {
    server: [resolve('src/entry-server.js')], // TODO: SSR服务入口（多入口？
  },
  output: {
    libraryTarget: 'commonjs2',
    path: resolve('app/public'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.[chunkhash:8].js?cors=1',
  },

  // 外置化应用程序依赖模块，可以使服务器构建速度更快，降低 bundle 体积。
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单，
    whitelist: [
      /^mint-ui/,
      /@tencent\/bcd\/src\/util\/.*/,
      /\.css$/,
    ]
  }),

  plugins: [
    new VueSSRServerPlugin(),
    new VueSSRServerModifyPlugin({
      outputPath: resolve(''),
      name: 'NovelReadServerBundle.conf', // TODO: 这里按需要修改
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ]
});

if (isProd) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  serverProdConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: /\.(css|js)/,
      threshold: 10240,
      minRatio: 0.8,
    })
  );
}
module.exports = serverProdConfig;
