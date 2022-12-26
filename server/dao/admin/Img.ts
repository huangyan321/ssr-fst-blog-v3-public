import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
const isProd = process.env.NODE_ENV === 'production';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class Upload {
  static async imgUpload(req: Request, res: Response) {
    try {
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) return res.send(tips.wrongParams);
      const file: any = req.file || {};
      const create_time = Utils.getDate19();
      // const getModelFunc = await getModel;
      // const userModel = getModelFunc('t_user');
      // const userInfo = await userModel.findAll({
      //   attributes: ['name', 'uid'],
      //   where: {
      //     uid,
      //   },
      // });
      file.url = isProd
        ? `https://docs.hgyn23.cn/static/${file.filename}`
        : `http://localhost:9000/static/${file.filename}`;
      res.send(file);
    } catch (err) {
      res.send({
        ...tips.upLoadError,
        detail: err
      });
    }
  }
}
