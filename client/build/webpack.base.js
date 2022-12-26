const { DefinePlugin, ProvidePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const { merge } = require('webpack-merge');
const resolvePath = require('./resolve-path');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const clientConfig = require('./webpack.client');
const serverConfig = require('./webpack.server');
const chalk = require('chalk');
module.exports = function (env) {
  const isProduction = !!env.production;
  const isClient = env.platform == 'client';
  process.env.isProduction = isProduction;
  const CSSLoaderChains = [
    isProduction && isClient ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    }
    // 'postcss-loader',
  ];
  const baseConfig = (isProduction) => {
    return {
      output: {
        filename: 'js/[name].bundle.js',
        //输出文件路径，必须是绝对路径
        path: resolvePath('/client/dist/'),
        //异步导入块名
        asyncChunks: true,
        //相对路径，解析相对与dist的文件
        publicPath: '/dist/'
      },
      module: {
        rules: [
          // 解析css
          {
            test: /\.css$/,
            //转换规则： 从下往上
            use: CSSLoaderChains
          },
          //解析less
          {
            test: /\.less$/,
            use: [...CSSLoaderChains, 'less-loader']
          },
          //解析scss
          {
            test: /\.scss$/,
            use: [...CSSLoaderChains, 'sass-loader']
          },
          //解析stylus
          {
            test: /\.styl(us)?$/,
            use: [...CSSLoaderChains, 'stylus-loader']
          },
          //解析js(x)
          {
            test: /\.(j|t)sx?$/,
            use: ['babel-loader'],
            exclude: (file) => /core-js/.test(file) && /node_modules/.test(file)
          },
          //解析图片资源
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: 'img/[hash][ext][query]'
            },
            parser: {
              dataUrlCondition: {
                maxSize: 1024 // 1kb
              }
            }
          },
          // 解析字体文件
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            type: 'asset/resource',
            generator: {
              filename: 'fonts/[hash][ext][query]'
            },
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 10kb
              }
            }
          },
          //解析vue文件,并提供HMR支持
          {
            test: /\.vue$/,
            //vue-loader的使用必须依赖VueLoaderPlugin
            use: ['vue-loader']
          }
        ]
      },
      plugins: [
        //! 定义全局常量
        new DefinePlugin({
          // 生产模式下取dist文件 否则取public
          BASE_URL: isProduction ? '"/dist/static/"' : '"/public/"',
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: false
        }),

        new VueLoaderPlugin(),
        AutoImport({
          resolvers: [ElementPlusResolver()]
        }),
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        // new MonacoWebpackPlugin({
        //   languages: ['javascript', 'typescript', 'html', 'css']
        // }),
        new ProgressBarPlugin({
          format:
            '  build [:bar] ' +
            chalk.green.bold(':percent') +
            ' (:elapsed seconds)',
          clear: false
        })
      ],
      resolve: {
        alias: {
          '@': resolvePath('/client/src'),
          config: '@/config',
          img: '@/assets/img',
          font: '@/assets/font',
          components: '@/components',
          router: '@/router',
          public: '@/public',
          service: '@/service',
          store: '@/store',
          styles: '@/styles',
          api: '@/api',
          utils: '@/utils',
          layout: '@/layout'
        },
        extensions: [
          '.js',
          '.vue',
          '.json',
          '.ts',
          '.jsx',
          '.less',
          '.styl',
          '.scss'
        ],
        //解析目录时用到的文件名
        mainFiles: ['index']
      }
    };
  };
  const config = baseConfig(isProduction);
  const mergeEnvConfig = isProduction
    ? merge(config, prodConfig(isClient))
    : merge(config, devConfig);
  const finalConfig = isClient
    ? merge(mergeEnvConfig, clientConfig(isProduction))
    : merge(mergeEnvConfig, serverConfig(isProduction));
  return finalConfig;
};
