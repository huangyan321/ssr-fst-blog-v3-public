#!/bin/bash
# docker内备份
user=root
password=175947
time=$(date +%Y%m%d%H%M%S);
data_dir="/home/back"
mysqldump -u$user -p$password db_myblog > $data_dir/db_myblog_docker_$time.sql
