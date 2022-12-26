import type { Express, Request, Response, NextFunction } from 'express';
import type { hyRequest } from '@server/@types/type';
import express from 'express';
import inflection from 'inflection';
import assert from 'http-assert';
import dao from '@server/dao/index';
const _type: 'user' | 'admin' = 'user';
export default (app: Express) => {
  var router = express.Router({
    mergeParams: true
  });
  //查询详细信息
  router.get(
    '/query',
    function (req: hyRequest, res: Response, next: NextFunction) {
      req.Model.queryOne(req, res);
    }
  );
  //查询所有列表
  router.get(
    '/queryAll',
    function (req: hyRequest, res: Response, next: NextFunction) {
      req.Model.queryByType(req, res);
    }
  );
  app.use(
    '/bp/api/:resource',
    function (req: hyRequest, res: Response, next: NextFunction) {
      //将路由名规范化为模块名称
      let resource = req.params.resource;
      let i = resource.indexOf('/');
      resource = i !== -1 ? resource.slice(0, i) : resource;
      const modelName: 'Blog' | 'Tag' = inflection.classify(resource) as
        | 'Blog'
        | 'Tag';
      //引入对应模块
      const model = dao[_type][modelName];
      //将模块挂在到req中
      req.Model = model;
      next();
    },
    router
  );
};
