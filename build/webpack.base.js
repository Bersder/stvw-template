const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpackbar = require('webpackbar');
const { resolve, createHappyPlugin } = require('./webpack.common');
const isProd = process.env.NODE_ENV === 'production';

const webpackBaseConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'eval-source-map',
  resolve: {
    modules: [resolve('node_modules')],
    extensions: ['.js', '.ts', '.vue', '.scss', '.css'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      Asset: resolve('src/assets'),
      Component: resolve('src/components'),
      Plugin: resolve('src/plugins'),
      Util: resolve('src/utils')
    }
  },

  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Testing',
      template: resolve('src/index.html'), //模板路径
      filename: 'index.html', //输出文件名
      minify: {
        collapseWhitespace: true, //消除空行
      },
      hash: true
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.[hash:8].min.css' //css抽离输出路径
    }),
    new Webpackbar(),
    new webpack.HashedModuleIdsPlugin({})
  ],

  // loader
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      include: [resolve('src')],
      exclude: /node_modules/
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: { transpileOnly: true, appendTsSuffixTo: [/\.vue$/] },
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('autoprefixer')]
            }
          }
        }
      ]
    }, {
      test: /\.s[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { importLoaders: 2 }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('autoprefixer')]
            }
          }
        },
        'sass-loader'
      ]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      exclude: /node_modules/,
      include: [resolve('src')],
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:8].[ext]',
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      exclude: /node_modules/,
      include: [resolve('src')],
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:8].[ext]',
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      exclude: /node_modules/,
      include: [resolve('src')],
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:8].[ext]',
      }
    }]
  }
};

if (process.env.ANALYZE === '1') {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackBaseConfig.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = webpackBaseConfig;
