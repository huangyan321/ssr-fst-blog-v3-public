#!/bin/sh
# docker内打包与启动
node -v
npm run build:no-check
echo '------完成-------'
echo '------重启-------'

npm run start
