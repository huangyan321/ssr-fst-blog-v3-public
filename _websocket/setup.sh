#!/bin/bash
# 创建共有网络
docker network create socket_server
# 打包镜像
docker build -t ws -f ./dockerfile.ws .
# 启动容器
docker run --name ws-server -d -p  9002:9002 --network socket_server ws