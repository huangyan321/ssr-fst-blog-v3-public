import type { Request, Response } from 'express';
import getModel from '@server/model/index';
import tips from '@server/utils/tip';
export default class Tag {
  static async queryByType(req: Request, res: Response) {
    const getModelFunc = await getModel;
    const model = getModelFunc('t_tag');
    const { rows: tags, count } = await model.findAndCountAll({
      attributes: ['name', 'tag_id'],
      order: [['create_time', 'DESC']],
      where: {
        is_delete: 0,
        publish: 1
      },
      raw: true
    });
    res.send({
      ...tips.ok,
      data: {
        tags,
        count
      }
    });
  }
}
