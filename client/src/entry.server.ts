import createApp from './main';
import type { SSRServerContext } from './@types/types';
import { renderToString } from 'vue/server-renderer';
export default async function serverEntry(
  context: SSRServerContext,
  isProduction: boolean,
  cb: (time: number) => {}
) {
  console.log('pass server');

  const { app, router, pinia } = createApp({ isServer: true });

  // 将状态给到服务端传入的context上下文，在服务端用于替换模板里的__INITIAL_STATE__，之后用于水合客户端的pinia
  await router.push(context.url);
  await router.isReady();

  const s = Date.now();
  const ctx = {};
  const html = await renderToString(app, ctx);
  if (!isProduction) {
    cb(Date.now() - s);
  }

  const matchComponents = router.currentRoute.value.matched;

  // 序列化 pinia 初始全局状态
  const state = JSON.stringify(pinia.state.value);
  context.state = state;

  if (!matchComponents.length) {
    context.next();
  }
  return { app, html, ctx };
}
