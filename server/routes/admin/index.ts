import type { Express, Request, Response, NextFunction } from 'express';
import type { hyRequest } from '@server/@types/type';
import express from 'express';
import multer from 'multer';
import inflection from 'inflection';
import assert from 'http-assert';
import path from 'path';
import loginRouter from './login';

import dao from '@server/dao/index';

import tips from '@server/utils/tip';

const _type: 'user' | 'admin' = 'admin';

const serverDest = process.cwd() + '/server';

export default (app: Express) => {
  var router = express.Router({
    mergeParams: true
  });
  //增加
  router.post(
    '/',
    function (req: hyRequest, res: Response, next: NextFunction) {
      req.Model.add(req, res);
    }
  );
  //删除
  router.delete(
    '/',
    function (req: hyRequest, res: Response, next: NextFunction) {
      req.Model.delete(req, res);
    }
  );
  //修改
  router.put('/', function (req: hyRequest, res: Response, next: NextFunction) {
    req.Model.edit(req, res);
  });
  //发布
  router.put(
    '/publish',
    function (req: hyRequest, res: Response, next: NextFunction) {
      switch (req.modelName) {
        case 'Blog':
          req.Model.changeBlogPublicStatus(req, res);
          break;
        case 'Note':
          req.Model.changeNotePublicStatus(req, res);
          break;
      }
    }
  );
  router.put(
    '/doUp',
    function (req: hyRequest, res: Response, next: NextFunction) {
      switch (req.modelName) {
        case 'Blog':
          req.Model.changeBlogTopStatus(req, res);
          break;
      }
    }
  );
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
  const upload = multer({
    dest: serverDest + '/static'
  });
  //文件上传
  app.use('/admin/api/upload', upload.single('file'), function (req, res) {
    (dao[_type]['Img'] as any).imgUpload(req, res);
  });
  app.use(
    '/admin/api/:resource',
    async function (req: hyRequest, res: Response, next: NextFunction) {
      //检验token
      if (!req.headers.authorization) return res.send(tips.noToken);

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
      req.modelName = modelName;
      next();
    },
    router
  );
  app.use('/admin/user', loginRouter);
};
