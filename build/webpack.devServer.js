
const { resolve } = require('./webpack.common');

// 开发服务器配置
module.exports = {
  contentBase: resolve('public'),
  compress: false,
  hot: true,
  port: 8080,
};
