const path = require('path');
const resolvePath = require('./resolve-path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',

  optimization: {
    minimize: false,
    //单独打包运行时代码
    runtimeChunk: false
  }
};
