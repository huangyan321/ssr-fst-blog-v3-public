import { db_instance } from '@server/opts';
import { DataTypes } from 'sequelize';
export default () =>
  db_instance.defineModel('t_img', {
    img_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING(40),
    uid: DataTypes.INTEGER,
    img_url: DataTypes.STRING(255)
  });
