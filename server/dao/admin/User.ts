import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class User {
  static async add(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['name', 'password']);
    try {
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) {
        return res.send({
          ...tips.nodata
        });
      }
      data.isTop = data.isTop || 0;
      const result = Utils.formatData(data, [
        {
          key: 'name',
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
      const { name, password } = data;
      const create_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const blog = await userModel.create({
        name,
        password,
        create_time,
        update_time: create_time
      });
      res.send({
        ...tips.ok,
        data: 1
      });
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams
      });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const data = Utils.filter(req.body, ['user_id']);
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) {
        return res.send({
          ...tips.nodata
        });
      }
      const result = Utils.formatData(data, [
        {
          key: 'user_id',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      } else if (data.user_id == 1) {
        return res.send({
          ...tips.noPermission
        });
      }
      let { user_id } = data;
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const user = await userModel.update(
        { is_delete: 1 },
        {
          where: {
            uid
          }
        }
      );
      res.send({
        ...tips.ok,
        data: 1
      });
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams,
        detail: err
      });
    }
  }
  static async edit(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['uid', 'name', 'password']);
    try {
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) {
        return res.send({
          ...tips.nodata
        });
      }
      data.isTop = data.isTop || 0;
      const result = Utils.formatData(data, [
        {
          key: 'uid',
          type: 'number'
        },
        {
          key: 'name',
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
      let { uid: user_id, name, password } = data;
      const update_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const blog = await userModel.update(
        {
          name,
          password,
          update_time
        },
        {
          where: {
            user_id
          }
        }
      );
      res.send({
        ...tips.ok,
        data: 1
      });
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams
      });
    }
  }
  static async queryOne(req: Request, res: Response) {
    try {
      const data = Utils.filter(req.query, ['user_id']);
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) {
        return res.send({
          ...tips.nodata
        });
      }
      const result = Utils.formatData(data, [
        {
          key: 'user_id',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let { user_id } = data;
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const user = await userModel.findAll({
        attributes: ['uid', 'name', 'create_time', 'update_time'],
        where: {
          uid: user_id,
          is_delete: 0
        }
      });
      if (user && user.length) {
        res.send({
          ...tips.ok,
          data: {
            user: user[0]
          }
        });
      } else {
        res.send({
          ...tips.nodata
        });
      }
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams,
        detail: err
      });
    }
  }
  static async queryByType(req: Request, res: Response) {
    try {
      const data = Utils.filter(req.query, ['pageSize', 'pageNum']);
      const { uid } = await JWT.verifySync(
        req.headers.authorization as string,
        (global as any).globalKey
      );
      if (!uid) {
        return res.send({
          ...tips.nodata
        });
      }
      const result = Utils.formatData(data, [
        {
          key: 'pageSize',
          type: 'number'
        },
        {
          key: 'pageNum',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let { pageSize = 10, pageNum = 1, type = 0, tag_id } = data;
      pageSize = Number(pageSize);
      pageNum = Number(pageNum);
      const offset = (pageNum - 1) * pageSize;
      const getModelFunc = await getModel;
      const userModel = getModelFunc('t_user');
      const { rows: users, count: total } = await userModel.findAndCountAll({
        attributes: ['name', 'uid', 'create_time', 'update_time'],
        order: [['update_time', 'DESC']],
        where: {
          is_delete: 0
        },
        offset,
        limit: pageSize
      });
      if (users && users.length) {
        res.send({
          ...tips.ok,
          data: {
            users,
            total,
            pageNum,
            pageSize
          }
        });
      } else {
        res.send({
          ...tips.nodata
        });
      }
    } catch (err) {
      console.log(err);
      res.send({
        ...tips.wrongParams,
        detail: err
      });
    }
  }
}
