import getModel from '@server/model/index';
import tips from '@server/utils/tip';
import Utils from '@server/utils';
import JWT from '@server/utils/jwt-utils';
// import { number, array } from 'is';
import type { Request, Response } from 'express';
export default class Blog {
  static async add(req: Request, res: Response) {
    const data = Utils.filter(req.body, [
      'title',
      'publish',
      'content',
      'tags',
      'brief',
      'is_top'
    ]);
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
          key: 'tags',
          type: 'array'
        },
        {
          key: 'title',
          type: 'string'
        },
        {
          key: 'brief',
          type: 'string'
        },
        {
          key: 'content',
          type: 'string'
        },
        {
          key: 'publish',
          type: 'number'
        },
        {
          key: 'is_top',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let {
        title = '无标题',
        content = '',
        tags = [],
        brief = '',
        ext_info = '',
        publish = 0,
        create_time = '',
        is_top = 0
      } = data;
      create_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const tagModel = getModelFunc('t_tag');
      const blog = await blogModel.create({
        title,
        content,
        create_time,
        update_time: create_time,
        publish,
        ext_info,
        brief,
        is_top,
        uid
      });
      tags = tags.map((tag: any) => {
        return {
          name: tag.name,
          blog_id: blog.dataValues.blog_id,
          create_time,
          update_time: create_time,
          uid,
          publish
        };
      });
      tags = await tagModel.bulkCreate(tags);
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
      const data = Utils.filter(req.body, ['blog_id']);
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
          key: 'blog_id',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      const { blog_id } = data;
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const tagModel = getModelFunc('t_tag');
      const deleteBlog = await blogModel.update(
        { is_delete: 1 },
        {
          where: {
            blog_id,
            uid
          }
        }
      );
      const deleteTag = await tagModel.update(
        { is_delete: 1 },
        {
          where: {
            blog_id,
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
    const data = Utils.filter(req.body, [
      'title',
      'content',
      'tags',
      'blog_id',
      'brief',
      'publish',
      'is_top'
    ]);
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
          key: 'tags',
          type: 'array'
        },
        {
          key: 'blog_id',
          type: 'number'
        },
        {
          key: 'title',
          type: 'string'
        },
        {
          key: 'brief',
          type: 'string'
        },
        {
          key: 'content',
          type: 'string'
        },
        {
          key: 'publish',
          type: 'number'
        },
        {
          key: 'is_top',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      let {
        title,
        content,
        tags,
        blog_id,
        brief,
        publish = 0,
        update_time = '',
        is_top = 0
      } = data;
      blog_id = Number(blog_id);
      update_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const tagModel = getModelFunc('t_tag');
      const blog = await blogModel.update(
        {
          title,
          content,
          brief,
          update_time,
          publish,
          is_top
        },
        {
          where: {
            blog_id,
            uid
          }
        }
      );
      const deleteTag = await tagModel.update(
        { is_delete: 1 },
        {
          where: {
            blog_id,
            uid
          }
        }
      );
      tags = tags.map((tag: any) => {
        return {
          name: tag.name,
          blog_id,
          create_time: update_time,
          update_time: update_time,
          uid,
          is_delete: 0,
          tag_id: tag.tag_id,
          publish
        };
      });
      for (const tag of tags) {
        tags = await tagModel.upsert(tag);
      }
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
  static async changeBlogTopStatus(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['blog_id', 'is_top']);
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
          key: 'blog_id',
          type: 'number'
        },
        {
          key: 'is_top',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      const { blog_id, is_top } = data;
      // const update_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const blog = await blogModel.update(
        {
          is_top
        },
        {
          where: {
            blog_id,
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
  static async changeBlogPublicStatus(req: Request, res: Response) {
    const data = Utils.filter(req.body, ['blog_id', 'publish']);
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
          key: 'blog_id',
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
      const { blog_id, publish } = data;
      // const update_time = Utils.getDate19();
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const tagModel = getModelFunc('t_tag');
      const blog = await blogModel.update(
        {
          publish
        },
        {
          where: {
            blog_id,
            uid
          }
        }
      );
      const tag = await tagModel.update(
        {
          publish
        },
        {
          where: {
            blog_id,
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
  static async queryOne(req: Request, res: Response) {
    try {
      const data = Utils.filter(req.query, ['blog_id']);
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
          key: 'blog_id',
          type: 'number'
        }
      ]);
      if (!result) {
        return res.send({
          ...tips.wrongFormat
        });
      }
      const { blog_id } = data;
      const getModelFunc = await getModel;
      const blogModel = getModelFunc('t_blog');
      const tagModel = getModelFunc('t_tag');
      const blog = await blogModel.findAll({
        attributes: [
          'title',
          'content',
          'blog_id',
          'brief',
          'publish',
          'is_top',
          'create_time',
          'update_time'
        ],
        where: {
          blog_id,
          uid,
          is_delete: 0
        },
        raw: true
      });
      const tags = await tagModel.findAll({
        attributes: ['name'],
        where: {
          blog_id,
          uid,
          is_delete: 0
        },
        raw: true
      });
      if (blog && blog.length) {
        blog[0].tags = tags;
        res.send({
          ...tips.ok,
          data: {
            blog: blog[0]
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
      const blogModel = getModelFunc('t_blog');
      const { rows: blogs, count: total } = await blogModel.findAndCountAll({
        attributes: [
          'blog_id',
          'title',
          'content',
          'create_time',
          'update_time',
          'publish',
          'brief',
          'is_top',
          'ext_info'
        ],
        order: [
          ['is_top', 'DESC'],
          ['update_time', 'DESC']
        ],
        where: {
          uid,
          is_delete: 0
        },
        offset,
        limit: pageSize
      });
      if (blogs && blogs.length) {
        res.send({
          ...tips.ok,
          data: {
            blogs,
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
