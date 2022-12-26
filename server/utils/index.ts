import Tips from './tip';
import IS from 'is';
import fs from 'fs';
import path from 'path';
import type { Valid, ValidObject } from '../@types/type';
/**
 * yyyy-MM-dd hh:mm:ss格式常量
 * @type {string}
 */
const f19: string = 'yyyy-MM-dd hh:mm:ss';
let util = {
  log: require('../../client/build/log'),
  //formatData 必须为 {key,type}的格式,可以不传type
  formatData(params: any, valids: Valid) {
    let res = true;
    if (!IS.object(params)) return false;
    if (!IS.array(valids)) return false;
    for (let i = 0; i < valids.length; i++) {
      let e = valids[i];
      let { key, type } = e;
      if (!key) {
        console.log('key值不存在');
        res = false;
        break;
      }
      let value = params[key] || params[key] === 0 || '';
      if (value !== 0 && IS.empty(value)) {
        console.log(`${key}的value为空`);
        res = false;
        break;
      }
      if (type === 'not_empty') {
        if (value !== 0 && IS.empty(value)) {
          console.log(`${key}的value为空`);
          res = false;
          break;
        }
      } else if (type === 'number') {
        value = Number(value);
        if (!IS.number(value) || IS.nan(value)) {
          console.log(`${key}的value不是number类型`);
          res = false;
          break;
        }
      } else if (type === 'reg') {
        let reg = e['reg'];
        if (!reg || !reg.test(value)) {
          console.log(`${key}的value不是reg类型`);
          res = false;
          break;
        }
      } else {
        if (!(IS as any)[type](value)) {
          console.log(`${key}的value不是对应的类型`);
          res = false;
          break;
        }
      }
    }
    return res;
  },
  filter(params: any, filterArr: string[]) {
    if (IS.object(params) && IS.array(filterArr)) {
      let data: any = {};
      filterArr.forEach((e) => {
        let val = params[e];
        if (
          (!IS.undefined(val) && !IS.null(val) && !IS.empty(val)) ||
          IS.empty(val) ||
          val === 0
        ) {
          data[e] = val;
        }
      });
      return data;
    } else {
      return params;
    }
  },
  // queryData(params, queryArr) {
  //   //仅适用于列
  //   let data = {};
  //   if (this.type(params) == 'object' && this.type(queryArr) == 'array') {
  //     queryArr.forEach((e) => {
  //       let val = params[e];
  //       if (!!val || val == 0) {
  //         data[e] = params[e];
  //       }
  //     });
  //   }
  //   return data;
  // },
  getDate19(time?: string) {
    if (time) {
      return (new Date(time) as any).format(f19);
    } else {
      return (new Date() as any).format(f19);
    }
  },

  getNowDay() {
    return util.getDate19().split(' ')[0];
  },
  // checkLogin(ctx) {
  //   let uid = ctx.cookies.get('uid');
  //   if (!uid) {
  //     return Tips[1005];
  //   } else {
  //     return Tips[0];
  //   }
  // },
  unique(arr: [], key: (((e: any) => {}) & string) | undefined) {
    if (!arr) return arr;
    if (key === undefined) return [...new Set(arr)];
    const map: any = {
      string: (e: any) => e[key],
      function: (e: any) => key(e)
    };
    const fn: any = map[typeof key];
    const obj = arr.reduce((o: any, e: any) => ((o[fn(e)] = e), o), {});
    return Object.values(obj);
  }
};
(Date as any).prototype.format = function (fmt: any) {
  var o: any = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};
export default util;
