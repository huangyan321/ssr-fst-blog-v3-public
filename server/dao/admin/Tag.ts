import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class Tag {
  // async queryOne(req: Request, res: Response) {
  //   try {
  //     const data = Utils.filter(req.query, ['tag_id']);
  //     const { uid } = await JWT.verifySync(
  //       req.headers.authorization as string,
  //       (global as any).globalKey
  //     );
  //     if (!uid) {
  //       return res.send({
  //         ...tips.nodata,
  //       });
  //     }
  //     const result = Utils.formatData(data, [
  //       {
  //         key: 'blog_id',
  //         type: 'number',
  //       },
  //     ]);
  //     if (!result) {
  //       return res.send({
  //         ...tips.wrongFormat,
  //       });
  //     }
  //     const { blog_id } = data;
  //     const getModelFunc = await getModel;
  //     const blogModel = getModelFunc('t_blog');
  //     const tagModel = getModelFunc('t_tag');
  //     const blogs = await blogModel.findAll({
  //       attributes: [
  //         'title',
  //         'content',
  //         'blog_id',
  //         'brief',
  //         'publish',
  //         'is_top',
  //         'create_time',
  //         'update_time',
  //       ],
  //       where: {
  //         blog_id,
  //         uid,
  //         is_delete: 0,
  //       },
  //     });
  //     const tags = await tagModel.findAll({
  //       attributes: ['name'],
  //       where: {
  //         blog_id,
  //         uid,
  //         is_delete: 0,
  //       },
  //     });
  //     if (blogs && blogs.length) {
  //       res.send({
  //         ...tips.ok,
  //         data: {
  //           blog: blogs[0],
  //           tags,
  //         },
  //       });
  //     } else {
  //       res.send({
  //         ...tips.nodata,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.send({
  //       ...tips.wrongParams,
  //       detail: err,
  //     });
  //   }
  // },
  static async queryByType(req: Request, res: Response) {
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
      const getModelFunc = await getModel;
      const tagModel = getModelFunc('t_tag');
      const { rows: tags, count: total } = await tagModel.findAndCountAll({
        attributes: ['name', 'tag_id'],
        order: [['create_time', 'DESC']],
        where: {
          publish: 1,
          is_delete: 0
        }
      });
      if (tags && tags.length) {
        res.send({
          ...tips.ok,
          data: {
            tags,
            total
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
