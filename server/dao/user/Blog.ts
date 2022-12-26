import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
export default class Blog {
  static async queryOne(req: Request, res: Response) {
    const data = Utils.filter(req.query, ['blog_id']);
    const result = Utils.formatData(data, [
      {
        key: 'blog_id',
        type: 'number'
      }
    ]);
    if (!result) {
      return res.send({
        ...tips.wrongFormat
      });
    }
    let { blog_id } = data;
    blog_id = parseInt(blog_id);

    const getModelFunc = await getModel;
    const blogModel = getModelFunc('t_blog');
    const tagModel = getModelFunc('t_tag');
    const blogs = await blogModel.findAll({
      attributes: [
        'title',
        'content',
        'blog_id',
        'brief',
        'publish',
        'create_time',
        'update_time',
        'is_top'
      ],
      where: {
        uid: 1,
        blog_id,
        is_delete: 0,
        publish: 1
      },
      raw: true
    });
    for (const blog of blogs) {
      const tags = await tagModel.findAll({
        attributes: ['name', 'tag_id'],
        where: {
          blog_id: blog.blog_id,
          uid: 1,
          is_delete: 0
        },
        raw: true
      });
      blog.tags = tags;
    }

    if (blogs && blogs.length) {
      res.send({
        ...tips.ok,
        data: {
          blog: blogs[0]
        }
      });
    } else {
      res.send({
        ...tips.nodata
      });
    }
  }
  static async queryByType(req: Request, res: Response) {
    const data = Utils.filter(req.query, [
      'pageSize',
      'pageNum',
      'tag_id',
      'type',
      'words'
    ]);
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
    let { pageSize = 10, pageNum = 1, type = 0, tag_id, words = '' } = data;
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let tags_id = tag_id ? tag_id.split(',') : [];
    const offset = (pageNum - 1) * pageSize;
    const getModelFunc = await getModel;
    const blogModel = getModelFunc('t_blog');
    const tagModel = getModelFunc('t_tag');
    //type = 1 分页查询 type=2 按标签分页查询 type=3 模糊查询
    if (type == 1) {
      const allTagNames = await tagModel.findAll({
        attributes: ['name'],
        order: [['update_time', 'DESC']],
        where: {
          //将传递数组将隐式使用in方法
          tag_id: tags_id,
          uid: 1,
          is_delete: 0,
          publish: 1
        },
        // raw 为true 结果为原始值
        raw: true
      });
      const allBlogIds = await tagModel.findAll({
        attributes: ['blog_id'],
        order: [['update_time', 'DESC']],
        where: {
          name: allTagNames.map((i: any) => i.name),
          uid: 1,
          is_delete: 0
        },
        raw: true
      });
      const { count, rows: blogs } = await blogModel.findAndCountAll({
        attributes: [
          'title',
          'blog_id',
          'brief',
          'is_top',
          'publish',
          'create_time'
        ],
        order: [
          ['is_top', 'DESC'],
          ['create_time', 'DESC']
        ],
        where: {
          blog_id: Array.from(new Set(allBlogIds.map((i: any) => i.blog_id))),
          uid: 1,
          is_delete: 0,
          publish: 1
        },
        offset,
        limit: pageSize,
        raw: true
      });
      for (const blog of blogs) {
        const tags = await tagModel.findAll({
          attributes: ['name', 'tag_id'],
          where: {
            blog_id: blog.blog_id,
            uid: 1,
            is_delete: 0
          }
        });
        blog.tags = tags;
      }
      if (count) {
        res.send({
          ...tips.ok,
          data: {
            blogs,
            count,
            pageNum,
            pageSize
          }
        });
      } else {
        res.send({
          ...tips.nodata
        });
      }
    } else if (type == 0) {
      const { count, rows: blogs } = await blogModel.findAndCountAll({
        attributes: [
          'blog_id',
          'title',
          'create_time',
          'update_time',
          'publish',
          'brief',
          'is_top',
          'ext_info'
        ],
        order: [
          ['is_top', 'DESC'],
          ['create_time', 'DESC']
        ],
        where: {
          uid: 1,
          is_delete: 0,
          publish: 1
        },
        offset,
        limit: pageSize,
        raw: true
      });
      for (const blog of blogs) {
        const tags = await tagModel.findAll({
          attributes: ['name'],
          where: {
            blog_id: blog.blog_id,
            uid: 1,
            is_delete: 0
          }
        });
        blog.tags = tags;
      }

      if (count) {
        res.send({
          ...tips.ok,
          data: {
            blogs,
            count
          }
        });
      } else {
        res.send({
          ...tips.nodata
        });
      }
    } else {
      const { count, rows: blogs } = await blogModel.findAndCountAll({
        attributes: [
          'blog_id',
          'title',
          'create_time',
          'update_time',
          'publish',
          'brief',
          'is_top',
          'ext_info'
        ],
        order: [
          ['is_top', 'DESC'],
          ['create_time', 'DESC']
        ],
        where: {
          uid: 1,
          is_delete: 0,
          publish: 1,
          title: {
            [Op.substring]: words
          }
        },
        raw: true
      });
      if (count) {
        res.send({
          ...tips.ok,
          data: {
            blogs
          }
        });
      } else {
        res.send({
          ...tips.nodata
        });
      }
    }
  }
}
