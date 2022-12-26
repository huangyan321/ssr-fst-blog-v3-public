import type { Express } from 'express';
import fs from 'fs';
import path from 'path';
import type { SSRServerContext } from '@/@types/types';
// @ts-ignore
// import serverManifest from '../client/dist/manifest.json';
import utils from './utils/index';
import escapeJSON from './utils/escape-json';
import { encode } from 'js-base64';
const resolvePath = require('../client/build/resolve-path.js');

const setupDevServer = require('../client/build/setup-dev-server.js');

let app: Express;
let wrapper: string;
let isProduction: boolean;
let serverEntry: any;
function pf(time: number) {
  utils.log.error(`实例渲染耗时：${time}ms`);
}
async function handleBundleWithEnv() {
  if (isProduction) {
    serverEntry = require(path.join(
      '../client/dist/js',
      'entry-server.js'
    )).default;
    wrapper = fs.readFileSync(
      path.join(__dirname, '../client/dist/index.html'),
      'utf-8'
    );
  } else {
    await setupDevServer(
      app,
      resolvePath('/client/dist/index.html'),
      (clientHtml: string, serverBundle: any) => {
        utils.log.success('setupDevServer invoked');
        wrapper = clientHtml;
        serverEntry = serverBundle;
        utils.log.success('等待触发');
      }
    );
  }
}
function pack(html: string, context: SSRServerContext, ctx: any) {
  // let teleportStr = '';
  // if (ctx) {
  //   for (const tel in ctx.teleports) {
  //     teleportStr += tel;
  //   }
  // }
  // console.log('teleportStr', teleportStr);

  // 合并html外壳
  return wrapper
    .replace('{{ APP }}', `<div id="app">${html}</div>`)
    .replace('{{ PINIA }}', encode(context.state as string) || '');
  // .replace('{{ TELEPORT }}', teleportStr || '');
}

export default async function compileSSR(server: Express, isProd: boolean) {
  try {
    app = server;
    isProduction = isProd;
    await handleBundleWithEnv();
    server.get('*', async (req, res, next) => {
      const context: SSRServerContext = {
        title: '前端学习的点滴',
        url: req.originalUrl,
        next
      };
      // 获取服务端 Vue实例
      const { app, html, ctx } = await serverEntry(context, isProduction, pf);
      const packagedHtml = pack(html, context, ctx);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(packagedHtml);
    });
  } catch (err) {
    console.log(err);
  }
}
