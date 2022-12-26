const fs = require('fs');
const memfs = require('memfs');
const path = require('path');
const resolvePath = require('./resolve-path');
const { patchRequire } = require('fs-monkey');
const webpack = require('webpack');
const chokidar = require('chokidar');
const log = require('./log');
// const rfs = require('require-from-string');
const clientConfig = require('./webpack.base')({
  production: false,
  platform: 'client'
});
const serverConfig = require('./webpack.base')({
  production: false,
  platform: 'server'
});
const readfile = (fs, file) => {
  try {
    log.info('readfile');
    return fs.readFileSync(file, 'utf8');
  } catch (e) {}
};

/**
 * 安装模块热替换
 * @param {*} server 服务器
 * @param {*} templatePath index.html 模板路径
 * @param {*} cb 回调函数
 */
module.exports = function setupDevServer(server, templatePath, cb) {
  log.info('进入开发编译节点');
  let template, readyPromise, ready, clientHtml, serverBundle;

  readyPromise = new Promise((resolve) => (ready = resolve));
  const update = () => {
    log.info('尝试更新');

    if (!clientHtml || !serverBundle)
      return log.warn(
        `${(!clientHtml && '套壳文件') || 'serverBundle'}当前未编译完成，等待中`
      );
    ready();
    log.info('发起回调');

    cb(clientHtml, serverBundle);
  };
  // 读取index.html文件
  template = readfile(fs, templatePath);
  // 监听index.html变化
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    log.success('index.html template updated.');
    clientHtml = template;
    update();
  });

  clientConfig.entry['entry-client'].unshift('webpack-hot-middleware/client');

  // clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  // dev middleware 开发中间件
  const clientCompiler = webpack(clientConfig);

  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath
    // noInfo: true,
  });
  // 安装 webpack开发模式中间件
  server.use(devMiddleware);
  // const clientMfs = new MFS();
  // 流式输出至内存中
  // clientCompiler.outputFileSystem = clientMfs;

  //serverComplier是webpack返回的实例，plugin方法可以捕获事件，done表示打包完成
  clientCompiler.hooks.done.tap('devServer', (stats) => {
    //核心内容，middleware.fileSystem.readFileSync是webpack-dev-middleware提供的读取内存中文件的方法；
    //不过拿到的是二进制，可以用JSON.parse格式化；
    clientHtml = readfile(
      clientCompiler.outputFileSystem,
      path.join(clientConfig.output.path, 'index.html')
    );
    update();
  });

  //hot middleware
  server.use(
    require('webpack-hot-middleware')(clientCompiler, {
      heartbeat: 5000
    })
  );

  // 监听和更新服务端文件

  const serverCompiler = webpack(serverConfig);

  // 流式输出至内存中
  serverCompiler.outputFileSystem = memfs.fs;

  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;

    stats = stats.toJson();
    if (stats.errors.length) return console.log(stats.errors[0]);
    log.success('watch done');
    patchRequire(memfs.fs, true);
    serverBundle = require(path.join(
      serverConfig.output.path,
      'js/entry-server.js'
    )).default;
    update();
  });
  return readyPromise;
};
