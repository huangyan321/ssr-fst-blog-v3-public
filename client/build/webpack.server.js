const webpack = require('webpack');
const resolvePath = require('./resolve-path');
const nodeExternals = require('webpack-node-externals');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
module.exports = (isProduction) => {
  const config = {
    target: 'node', // in node env
    entry: {
      'entry-server': resolvePath('/client/src/entry.server.ts')
    },
    output: {
      filename: 'js/entry-server.js',
      library: {
        type: 'commonjs2'
      }
    },
    node: {
      // tell webpack not to handle following
      __dirname: false,
      __filename: false
    },
    module: {},
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    externals: [
      // nodeExternals({
      //   // polyfill, .vue, .css
      //   allowlist: [/\.(css|sass|scss|styl)$/, /\.(vue)$/, /\.(html)$/],
      // }),
    ] // external node_modules deps
  };
  isProduction
    ? config.plugins.push(
        new WebpackManifestPlugin(),
      )
    : '';
  return config;
};
