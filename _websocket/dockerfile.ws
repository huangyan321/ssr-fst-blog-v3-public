# 指定我们的基础镜像是node，版本是v8.0.0
 FROM node:16-alpine
# 指定制作我们的镜像的联系人信息（镜像创建者）
 MAINTAINER huangyan321
 EXPOSE 9002
# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
 COPY . /ws/instance/
 RUN cd /ws/instance \
     && npm install --registry=https://registry.npmmirror.com
# 到工作目录
 WORKDIR /ws/instance
# 容器启动时执行的命令，类似npm run start
 CMD ["npm", "start"]