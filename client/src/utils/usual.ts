export function unique(arr: any, key: string | (() => {})) {
  if (!arr) return arr;
  if (key === undefined) return [...new Set(arr)];
  const map: any = {
    string: (e: any) => e[key as string],
    function: (e: any) => (key as any)(e)
  };
  const fn = map[typeof key];
  const obj = arr.reduce(
    (o: any, e: any) => (
      o[fn(e)] && o[fn(e)].count
        ? o[fn(e)].count++
        : (o[fn(e)] = {
            tag_id: e.tag_id,
            count: 1
          }),
      o
    ),
    {}
  );
  return Object.entries(obj);
}
export const isServer = typeof window === 'undefined';

export function debounce(func: any, delay: number, immediate = false) {
  //存储上一次触发的timer
  let timer: NodeJS.Timeout | null = null;
  let invoke = false;
  function _debounce(this: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      //清除上一次触发的timer
      timer ? clearTimeout(timer) : '';
      //在触发延迟回调前只执行一次
      if (immediate && !invoke) {
        invoke = true;
        const result = func.apply(this, args);
        //使用resolve把返回值抛出
        resolve(result);
      } else {
        timer = setTimeout(() => {
          //触发回调后 再次初始化
          invoke = false;
          //绑定调用该函数上下文的this
          const result = func.apply(this, args);
          resolve(result);
        }, delay);
      }
    });
  }
  _debounce.cancel = function () {
    timer ? clearTimeout(timer) : '';
    timer = null;
    invoke = false;
  };
  return _debounce;
}
export function throttle(
  func: any,
  interval: number,
  options = { immediate: true, trailing: true }
) {
  //记录上一次开始时间
  let lastTime = 0;
  let timer: NodeJS.Timeout | null = null;
  const { immediate, trailing } = options;
  return function _throttle(this: any, ...args: any[]) {
    //获取当前事件触发的时间
    const nowTime = new Date().getTime();
    if (!lastTime && !immediate) lastTime = nowTime;
    //计算还需要多长时间才触发函数
    //给定的时间间隔减去当前时间与上次开始时间之差
    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      timer ? clearTimeout(timer) : '';
      timer = null;
      func.apply(args);
      lastTime = nowTime;
      return;
    }
    if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(args);
        lastTime = !immediate ? 0 : new Date().getTime();
      }, remainTime);
    }
  };
}
//判断是否为pc端
export function IsPC() {
  if (typeof navigator === 'undefined') return true;
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array(
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  );
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
