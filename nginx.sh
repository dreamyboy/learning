#!/bin/sh


//最新版Nginx，直接sudo nginx 就可以启动了


#运行前记得更改此文件的权限 chmod 777 nginx.sh

stop() {
	echo 'stop nginx'
	cd '/usr/local/nginx/conf' && pkill -9 nginx &
}

start() {
	echo 'start nginx'
	cd '/usr/local/nginx/conf' && /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf &
}

reload() {
	echo 'reload nginx && update config'
	cd '/usr/local/nginx/conf' && /usr/local/nginx/sbin/nginx -s reload &
}


case $1 in
	"stop")
		stop
		;;
	"start")
		start
		;;
	"restart")
		stop
		start
		;;
	"reload")
		reload
		;;
esac
