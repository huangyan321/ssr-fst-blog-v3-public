import { Sequelize, DataTypes, Dialect } from 'sequelize';
import userConfig from '@server/config/user-config';
//封装Sequelize实例
export default class DB {
  sequelize: Sequelize;
  constructor() {
    this.sequelize = new Sequelize(
      userConfig.database,
      userConfig.user,
      userConfig.password,
      {
        host: userConfig.host,
        dialect: userConfig.dialect as Dialect,
        pool: userConfig.pool,
        //是否开启日志
        logging: userConfig.logging,
        dialectOptions: userConfig.dialectOptions,
        define: userConfig.define
      }
    );
  }
  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  async close() {
    await this.sequelize.close();
  }
  async sync() {
    await this.sequelize.sync();
  }
  async defineModel(name: string, attributes: any) {
    const attrs: any = {};
    for (let key in attributes) {
      let val = attributes[key];
      if (typeof val === 'object' && val['type']) {
        val.allowNull = val.allowNull || false;
        attrs[key] = val;
      } else {
        attrs[key] = {
          type: val,
          allowNull: false
        };
      }
    }
    attrs.is_delete = {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    };
    return this.sequelize.define(name, attrs, {
      tableName: name,
      timestamps: true
    });
  }
}
