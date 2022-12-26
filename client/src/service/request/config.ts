const isServer = typeof window === 'undefined';
const isProd = process.env.NODE_ENV === 'production';

export const TIME_OUT = 5000;
// 默认请求时展示loading
export const DEFAULT_LOADING = false;

export const BASE_URL = isServer && isProd
  ? 'http://blogv3:9000/bp/api/'
  : 'https://docsv3.hgyn23.cn/bp/api/';
