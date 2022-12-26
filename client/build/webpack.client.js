const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolvePath = require('./resolve-path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const InlineChunkHtmlPlugin = require('./plugins/InlineChunkHtmlPlugin');
module.exports = (isProduction) => {
  const config = {
    entry: {
      'entry-client': [resolvePath('/client/src/entry.client.ts')]
    },
    plugins: [
      //! 根据模板生成入口html
      new HtmlWebpackPlugin({
        title: 'lan bi tou',
        filename: 'index.html',
        template: resolvePath('/client/public/index.html'),
        inject: true,
        // // 注入到html文件的什么位置
        // inject: true,
        // // 当文件没有任何改变时使用缓存
        // cache: true,
        minify: isProduction
          ? {
              // 是否移除注释
              removeComments: true,
              // 是否移除多余的属性
              removeRedundantAttributes: true,
              // 是否移除一些空属性
              removeEmptyAttributes: true,
              // 折叠空格
              collapseWhitespace: true,
              // 移除linkType
              removeStyleLinkTypeAttributes: true,
              minifyCSS: true,
              minifyJS: {
                mangle: {
                  toplevel: true
                }
              }
            }
          : false
      })
    ]
  };
  if (isProduction) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].[contenthash:6].chunk.min.css'
      }),
      new CleanWebpackPlugin(),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(css)$/])
    );
  }
  return config;
};
