import type { DaoType } from '@server/@types/dao.type';

import admin_admin from './admin/Admin';
import admin_blog from './admin/Blog';
import admin_img from './admin/Img';
import admin_note from './admin/Note';
import admin_tag from './admin/Tag';
import admin_user from './admin/User';

import user_blog from './user/Blog';
import user_tag from './user/Tag';

// 统一导出
const dao: DaoType = {
  admin: {
    Admin: admin_admin,
    Blog: admin_blog,
    Img: admin_img,
    Note: admin_note,
    Tag: admin_tag,
    User: admin_user
  },
  user: {
    Blog: user_blog,
    Tag: user_tag
  }
};

export default dao;
