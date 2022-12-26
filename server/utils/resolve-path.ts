const pathResolve = function (path: string): string {
  //当前node进程跑的目录
  return process.cwd() + path;
};
export default pathResolve;
