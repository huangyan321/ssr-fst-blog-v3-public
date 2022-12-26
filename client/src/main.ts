import { createSSRApp } from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import createRouter from '@/router';
import createStore from '@/store';
import registerApp from './components';
import type { SSREntryOptions } from './@types/types';
import { ID_INJECTION_KEY } from 'element-plus';
import 'normalize.css';
export default function createApp({ isServer }: SSREntryOptions) {
  const router = createRouter(isServer);
  // 初始化 pinia
  const pinia = createStore();

  const app = createSSRApp(App);
  app.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0
  });
  registerApp(app);
  app.use(router);
  // 挂载 pinia
  app.use(pinia);
  // app.use(VueMeta)
  return { app, router, pinia };
}
