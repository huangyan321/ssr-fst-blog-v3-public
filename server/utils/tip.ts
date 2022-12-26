export default {
  ok: {
    code: 200,
    msg: 'ok!'
  },
  busy: {
    code: 1002,
    msg: '系统繁忙！'
  },
  nodata: {
    code: 1003,
    msg: '暂无数据！'
  },
  noLogin: {
    code: 1005,
    msg: '请先登录'
  },
  wrongAccount: {
    code: 1006,
    msg: '账号或密码错误！'
  },
  wrongFormat: {
    code: 1007,
    msg: '参数格式错误'
  },
  wrongParams: {
    code: 1008,
    msg: '查询失败，请检查参数是否正确！'
  },
  abnormal: {
    code: 1009,
    msg: '账号异常！'
  },
  netBusy: {
    code: 1010,
    msg: '网络繁忙，请稍后重试！'
  },
  noPermission: {
    code: 1012,
    msg: '您没有权限删除该管理员！'
  },
  noToken: {
    code: 1013,
    msg: '未找到token，请重新登录'
  },
  upLoadError: {
    code: 1014,
    msg: '文件传输失败，请检查配置'
  }
};
