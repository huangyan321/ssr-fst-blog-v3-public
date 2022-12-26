function historyApiFallback(options) {
  const expressMiddleware = require('connect-history-api-fallback')(options);
  const url = require('url');
  return (req, res, next) => {
    let parseUrl = url.parse(req.url);
    console.log(parseUrl);
    // 添加path match，让不匹配的路由可以直接穿过中间件
    if (!parseUrl.pathname.match(options.path)) {
      return next();
    }
    return expressMiddleware(req, res, next);
  };
}

module.exports = historyApiFallback;
