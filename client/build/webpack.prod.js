const CopyWebpackPlugin = require('copy-webpack-plugin');
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const resolvePath = require('./resolve-path');
const compressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SendAMessageWebpackPlugin = require('send-a-message-after-emit-plugin');

module.exports = function (isClient) {
  return {
    mode: 'production',

    plugins: [
      //! 用于复制资源
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'client/public',
            to: 'static',
            globOptions: {
              //! 选择要忽略的文件
              ignore: ['**/index.html', '**/.DS_store']
            }
          }
        ]
      }),
      new CSSMinimizerWebpackPlugin(),
      new SendAMessageWebpackPlugin({
        wsUrl: 'ws://159.75.104.17:9002',
        message: 'from webpack',
        platform: isClient ? 'client' : 'server'
      })
      // new BundleAnalyzerPlugin()
    ],
    optimization: {
      //默认开启，标记未使用的函数，terser识别后可将其删除
      usedExports: true,
      mangleExports: true,
      // minimize: true,
      splitChunks: {
        //同步异步导入都进行处理
        chunks: 'all',
        //拆分块最小值
        // minSize: 20000,
        //拆分块最大值
        maxSize: 200000,
        //表示引入的包，至少被导入几次的才会进行分包，这里是1次
        // minChunks: 1,
        // 包名id算法
        // chunkIds: 'named',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            //所有来自node_modules的包都会打包到vendors里面,可能会过大,所以可以自定义选择打包
            test: /[\/]node_modules[\/](vue|element-plus|normalize\.css)[\/]/,
            filename: 'js/vendors.js',
            chunks: 'all',
            //处理优先级
            priority: 20,
            enforce: true
          },
          monacoEditor: {
            chunks: 'async',
            name: 'chunk-monaco-editor',
            priority: 22,
            test: /[\/]node_modules[\/]monaco-editor[\/]/,
            enforce: true,
            reuseExistingChunk: true
          }
          // default: {
          //   minChunks: 2,
          //   priority: 23,
          //   filename: 'js/[id].common.js',
          //   reuseExistingChunk: true,
          //   enforce: true
          // }
        }
      },
      //单独打包运行时代码
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          //剥离注释
          extractComments: false,
          // 服务器性能原因，关闭并发
          parallel: false,
          terserOptions: {}
        })
      ]
    }
  };
};
