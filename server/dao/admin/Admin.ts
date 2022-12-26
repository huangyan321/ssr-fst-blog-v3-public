import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class Admin {
  static async login(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['username', 'password']);
    const result = Utils.formatData(data, [
      {
        key: 'username',
        type: 'string'
      },
      {
        key: 'password',
        type: 'string'
      }
    ]);
    if (!result) {
      return res.send({
        ...tips.wrongFormat
      });
    }
    let { username: name, password } = data;
    try {
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const user = await userModel.findAll({
        where: {
          name,
          password
        }
      });
      if (user && user.length && user[0].uid) {
        const uid = user[0].uid;
        try {
          const token = JWT.sign(
            {
              uid
            },
            (global as any).globalKey,
            '1day'
          );
          res.send({
            ...tips.ok,
            token
          });
        } catch (err) {
          res.send({
            ...tips.wrongAccount
          });
        }
      } else {
        res.send({
          ...tips.wrongAccount
        });
      }
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams
      });
    }
  }
  static async getUserInfo(req: Request, res: Response) {
    try {
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) return res.send(tips.wrongParams);
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const userInfo = await userModel.findAll({
        attributes: ['name', 'uid'],
        where: {
          uid
        }
      });
      if (userInfo && userInfo.length) {
        res.send({
          ...tips.ok,
          data: userInfo[0]
        });
      } else {
        res.send({
          ...tips.wrongAccount,
          data: null
        });
      }
    } catch (err) {
      res.send({
        ...tips.abnormal,
        data: err
      });
    }
  }
}
