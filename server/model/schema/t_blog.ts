import { db_instance } from '@server/opts';
import { DataTypes } from 'sequelize';
export default () =>
  db_instance.defineModel('t_blog', {
    blog_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: DataTypes.STRING(200),
    uid: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    publish: DataTypes.TINYINT,
    brief: DataTypes.TEXT,
    ext_info: DataTypes.TEXT,
    is_top: DataTypes.STRING(255)
  });
