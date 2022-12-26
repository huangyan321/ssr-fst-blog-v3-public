import express from 'express';
// import 'express-async-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import cache from 'lru-cache';

import allowedOrigin from './config/white-list';

import userRoute from './routes/user';
import adminRoute from './routes/admin';
import errorHandler from './utils/error-handler';
import compileSSR from './compile';
// 区分生产环境
const isProd = process.env.NODE_ENV === 'production';

const resolve = (file: string) => path.resolve(__dirname, file);

const app = express();
Object.defineProperty(global, 'globalKey', {
  value: '123456'
});
function isOriginAllowed(origin: string | undefined, allowedOrigin: string[]) {
  for (let i = 0; i < allowedOrigin.length; i++) {
    if (origin === allowedOrigin[i]) {
      return true;
    }
  }
  return false;
}
// 跨域配置
app.all('*', function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  let reqOrigin = req.headers.origin;
  if (isOriginAllowed(reqOrigin, allowedOrigin)) {
    res.header('Access-Control-Allow-Origin', reqOrigin);
  } else {
    res.header('Access-Control-Allow-Origin', 'http://docs.hgyn23.cn');
  }
  // 允许的header类型
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Access-Token,Appid,Secret,Authorization'
  );
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.sendStatus(200);
  // 让options尝试请求快速结束
  else next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/static'));
//微缓存服务
const serve = (path: string, cache: boolean) =>
  express.static(resolve(path), {
    maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
  });
if (isProd) {
  app.use('/dist/', serve('../client/dist', false));
}
app.use('/public/', serve('../client/public', true));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '../client'));
userRoute(app);
adminRoute(app);
compileSSR(app, isProd);
// errorHandler(app);
export default app;
