# 宿主机执行docker备份指令
#!/bin/bash
docker_name=dbv3
docker exec -i $docker_name sh /mysql/docker_back_sql_inner.sh
echo '导出成功'
cd /root/sql_back_myblog
echo '删除三天前的文件'
find /root/sql_back_myblog/ -name "*.sql*"  -mtime +3 -exec rm {} \;
echo '正在提交'
git add .
git commit -m 'Jenkins 定时执行备份 '
git push