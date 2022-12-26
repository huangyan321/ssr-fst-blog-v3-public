import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory
} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
// import useListStore from '@/store/modules/list';
// import { IsPC } from '@/utils/usual';
import Main from '@/views/post/index.vue';
import List from '@/views/post/list.vue';
import Article from '@/views/post/article.vue';
import Demo from '@/views/demo.vue';
import Read from '@/views/read.vue';
import File from '@/views/file.vue';
// const Main = () =>
//   import(
//     /* webpackChunkName: "main" */
//     /* webpackPrefetch: true */ '@/views/post/index.vue'
//   );
// const List = () =>
//   import(
//     /* webpackChunkName: "list" */
//     /* webpackPrefetch: true */ '@/views/post/list.vue'
//   );
// const Article = () =>
//   import(
//     /* webpackChunkName: "article" */
//     /* webpackPrefetch: true */ '@/views/post/article.vue'
//   );
// const Demo = () =>
//   import(
//     /* webpackChunkName: "demo" */
//     /* webpackPrefetch: true */ '@/views/demo.vue'
//   );
// const Read = () =>
//   import(
//     /* webpackChunkName: "read" */
//     /* webpackPrefetch: true */ '@/views/read.vue'
//   );
// const File = () =>
//   import(
//     /* webpackChunkName: "file" */
//     /* webpackPrefetch: true */ '@/views/file.vue'
//   );
const Editor = () =>
  import(
    /* webpackChunkName: "editor" */
    /* webpackPrefetch: true */ '@/views/editor.vue'
  );
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'Main',
    redirect: { name: 'List' },
    component: Main,
    children: [
      // 主页 文章列表
      {
        path: 'list',
        name: 'List',
        component: List
      },
      // 主页 文章详情
      {
        path: 'post/:id',
        name: 'Post',
        component: Article
      }
    ]
  },
  {
    //  文章归档
    path: '/file',
    name: 'File',
    component: File
  },
  //  阅读
  {
    path: '/read',
    name: 'Read',
    component: Read
  },
  //  关于
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About
  // },
  //  实验品
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  }
];
export default function createRouter(isServer: Boolean) {
  return _createRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (to.fullPath === from.fullPath) return false;
      if (savedPosition) {
        return savedPosition;
      } else {
        // if (IsPC()) return { top: 0 };
        // const listStore = useListStore();
        // listStore.BScrollInstance?.scrollTo(0, 0);
        // return false;
        return { top: 0 };
      }
    }
  });
}
