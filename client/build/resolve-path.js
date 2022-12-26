const pathResolve = function (path) {
  //当前node进程跑的目录
  return process.cwd() + path;
};
module.exports = pathResolve;
