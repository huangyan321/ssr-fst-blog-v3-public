import { db_instance } from '@server/opts';
import { DataTypes } from 'sequelize';
export default () =>
  db_instance.defineModel('t_note', {
    note_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uid: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    publish: DataTypes.STRING(255)
  });
