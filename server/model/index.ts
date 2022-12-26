import type { Models } from '@server/@types/db.d';
import type { ModelStatic } from 'sequelize';

import { db_instance } from '@server/opts';

import defineTableBlog from './schema/t_blog';
import defineTableImg from './schema/t_img';
import defineTableNote from './schema/t_note';
import defineTableTag from './schema/t_tag';
import defineTableUser from './schema/t_user';

import utils from '@server/utils';
function format(res: Models) {
  const tableMap: any = {};
  for (let key in res) {
    tableMap[res[key].tableName] = res[key];
  }
  return tableMap;
}
async function registerAllModels() {
  utils.log.warn('测试数据库连接');

  await db_instance.connect().catch((err) => {
    utils.log.error(err);
  });

  const res: Models = await Promise.all([
    defineTableBlog(),
    defineTableImg(),
    defineTableNote(),
    defineTableTag(),
    defineTableUser()
  ]);

  utils.log.info('模型同步中');

  await db_instance.sync();

  utils.log.success('所有模型均已成功同步');

  return format(res);
}

async function getModel() {
  const modelsMap = await registerAllModels();

  return function (key: string): ModelStatic<any> {
    return modelsMap[key];
  };
}

export default getModel();
