#!/bin/bash
# 关闭服务容器，删除镜像文件
docker compose down
docker stop blogv3 dbv3
docker rm blogv3 dbv3
docker rmi ssr_fst_blog-v3-blogv3 ssr_fst_blog-v3-db
