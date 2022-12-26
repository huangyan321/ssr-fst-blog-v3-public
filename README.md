# ssr-fst-blog-v3

## 简介

## install

 ```shell
 // 依赖安装
  npm install
 ```

## Usage

### 开发阶段

- 将`/server/config/user-config.ts`的host改为你的mysql服务地址,并填写好相关配置
- 将`/client/build/webpack.prod.js`中的`TerserPlugin.parallel`改为`true`

```js
 // 前台项目 后端项目开发
 npm run dev
```

 启动流程

  1. 启动服务器并尝试连接数据库
  2. webpack开始对双端文件进行编译，并启动热更新。
  3. 等待编译完成，开启本地调试端口，端口可在`server\bin\www.ts`设置。
  4. 打开浏览器，进行dev阶段开发即可

### 生产阶段

- `docker` 一键部署:
  - 根据自身需求配置`.sh/docker`下的`shell`文件
  - 根据自身需求配置`docker-compose` 文件和`dockerfile`文件
  - 将`/server/config/user-config.ts`的host改为`docker-compose`中`mysql`数据库网桥地址`db`
  - 于服务器部署时，务必关注`/client/build/webpack.prod.js`中的`TerserPlugin.parallel`，根据服务器性能酌情选择合适的**并发数**；且在`docker-compose.yml`配置中限制好cpu和内存占用率，防止宕机卡死
  - 执行shell

    ```bash
    // 删除容器
    chmod +x ./.sh/docker/rmci.sh
    sh ./.sh/docker/rmci.sh
    // -d 为后台启动
    docker compose up -d
    ```

  - 由于需要防止宕机，webpack构建是在容器创建完后再开始，所以如果为后台启动，则看不到内部打包进度，需要转到`打包通知功能`
  - 等待容器内文件构建完毕，期间可通过 `docker stats` 查看 `cpu` 占用，来确定是否构建完毕

- `pm2`管理

  ```js
  // 前台项目打包
   npm run build:no-check
  // 服务端开启
   pm2 start npm --name "ssr_fst_blog-v3" -- run start
  ```

  >  生产环境下，服务器将托管客户端`dist`文件夹
  >
### sql备份

服务器备份根文件夹 `/root/sql_back_myblog`

`docker` 挂载目录`/home/back`

### 打包通知功能

#### 使用

```shell
sh ./_websocket/setup.sh
```

客户端接收通知可参考我的另一个仓库[webpack-notifier](https://github.com/huangyan321/webpack-notifier)
容器运行后将开放容器共享网络`socket_server`,并暴露`9002`端口给宿主机

**注意: 使用该功能时记得在打包本项目其他容器之前安装,否则无法建立连接**

#### 架构

浏览器插件`ws`客户端(以下简称`client`端) <---> 服务端`ws`容器(以下简称`server`端) <---> 服务端打包容器`ssr-fst-blog-v3`(以下简称`build`端)

`build`端使用定制插件`send-a-message-after-emit-plugin`检测`webpack`打包,打包完成后会和`server`端建立连接并发送打包结束指令,收到指令后`server`端开始广播,提前与`server`端建立连接的`client`端将接收到指令,经过判断后进行通知操作
