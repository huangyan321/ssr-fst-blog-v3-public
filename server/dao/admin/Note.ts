import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class Note {
  static async add(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['content', 'publish']);
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
          key: 'content',
          type: 'string'
        },
        {
          key: 'publish',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let { content = '', publish = 0 } = data;
      const create_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const noteModel = getModelFunc('t_note');
      const blog = await noteModel.create({
        content,
        uid,
        publish
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
      const data = Utils.filter(req.body, ['note_id']);
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
          key: 'note_id',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      const { note_id } = data;
      const getModelFunc = await getModel;
      const noteModel = getModelFunc('t_note');
      const deleteNote = await noteModel.update(
        { is_delete: 1 },
        {
          where: {
            note_id,
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
  static async changeNotePublicStatus(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['note_id', 'publish']);
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
      const result = Utils.formatData(data, [
        {
          key: 'note_id',
          type: 'number'
        },
        {
          key: 'publish',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      const { note_id, publish } = data;
      // const update_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const noteModel = getModelFunc('t_note');
      const note = await noteModel.update(
        {
          publish
        },
        {
          where: {
            note_id,
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
        ...tips.wrongParams
      });
    }
  }
  static async queryByType(req: Request, res: Response) {
    try {
      const data = Utils.filter(req.query, ['pageSize', 'pageNum', 'type']);
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
          key: 'type',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let { pageSize = 10, pageNum = 1, type = 0 } = data;
      pageSize = Number(pageSize);
      pageNum = Number(pageNum);
      const offset = (pageNum - 1) * pageSize;
      const getModelFunc = await getModel;
      const noteModel = getModelFunc('t_note');
      const total = await noteModel.count({
        where: {
          is_delete: 0
        }
      });
      if (type == 1) {
        const notes = await noteModel.findAll({
          attributes: ['note_id', 'content', 'publish', 'create_time'],
          order: [['create_time', 'DESC']],
          where: {
            uid,
            is_delete: 0
          },
          offset,
          limit: pageSize
        });
        if (notes && notes.length) {
          res.send({
            ...tips.ok,
            data: {
              notes,
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
      } else {
        const notes = await noteModel.findAll({
          attributes: ['note_id', 'content', 'publish', 'create_time'],
          order: [['create_time', 'DESC']],
          where: {
            uid,
            is_delete: 0
          }
        });
        if (notes && notes.length) {
          res.send({
            ...tips.ok,
            data: {
              notes,
              total
            }
          });
        } else {
          res.send({
            ...tips.nodata
          });
        }
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
