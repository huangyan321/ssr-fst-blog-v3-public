import { db_instance } from '@server/opts';
import { DataTypes } from 'sequelize';
export default () =>
  db_instance.defineModel('t_user', {
    uid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    password: DataTypes.STRING(50),
    name: DataTypes.STRING(20)
  });
