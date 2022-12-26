import { db_instance } from '@server/opts';
import { DataTypes } from 'sequelize';
export default () =>
  db_instance.defineModel('t_tag', {
    tag_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: DataTypes.INTEGER,
    name: DataTypes.STRING(20),
    blog_id: DataTypes.INTEGER,
    publish: DataTypes.STRING(255)
  });
