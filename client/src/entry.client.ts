import createApp from './main';
import { decode } from 'js-base64';

(async () => {
  console.log('pass client');
  const { app, router, pinia } = createApp({ isServer: false });
  // 等待router准备好组件
  await router.isReady();
  // 挂载时将pinia在服务端初始化后的状态注入到客户端进行hydrate
  if (window.__INITIAL_STATE__) {
    pinia.state.value = JSON.parse(decode(window.__INITIAL_STATE__));
  }
  // 挂载
  app.mount('#app');
})();
