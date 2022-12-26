export default {
  host: 'your mysql host',
  user: 'your username',
  password: 'your password',
  port: '3306', // mysql服务端口
  database: 'db_myblog', // 数据库
  multipleStatements: true, //允许多条sql同时执行
  dialect: 'mysql',
  //是否开启日志
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  define: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
