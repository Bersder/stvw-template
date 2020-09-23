const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// HappyPlugin实例创建函数
const createHappyPlugin = (id, loaders) => new HappyPack({
  id,
  loaders,
  threadPool: happyThreadPool,
  verbose: process.env.HAPPY_VERBOSE === '1', // 是否打印状态信息，通过HAPPY_VERBOSE控制
});
// 修正resolve根地址为项目根
function resolve(...dir) {
  return path.resolve(__dirname, '../', ...dir);
}

module.exports = {
  createHappyPlugin,
  resolve,
  runtimeChunk: {
    name: entryPoint => `${entryPoint.name}_runtime`
  },
  splitChunks: {
    chunks: 'all',
    minSize: 30000, // 触发分割的最低体积
    minChunks: 2, // 触发分割的引用次数
    automaticNameDelimiter: '_', // 命名分隔符
    cacheGroups: {
      vendors: {// 第三方模块
        test: /[\\/]node_modules[\\/]/,
        priority: -10 //优先级更高
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
};
