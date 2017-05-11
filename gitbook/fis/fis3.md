#fis3介绍
##目录
* ** fis3介绍(构建工具) **
  * fis3的基本命令
  * fis3的配置方法
  * fis3构建大致步骤
  * fis3与fis2的区别
* ** fisp介绍(基于PHP解决方案) **
  * fisp的基本命令
  * fisp的目录规范
  * fisp的模板
  * fisp构建大致步骤
* ** yog2介绍(基于nodejs解决方案) **
  * yog2的基本命令
  * yog2的目录规范
  * yog2的路由
  * yog2的MVC
  * yog2的插件系统
  * yog2的模板
  * yog2构建大致步骤

#fis3介绍
* fis3 是面向前端的工程`构建工具`。
* 解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。
* fis3构建依赖的是很多插件（即npm包，很多插件已经内置了）。
* fis3的构建是不会对源码做修改的，而是增量发布。

#fis3的基本命令
```
$ fis3 -h
$ fis3 release -h
$ fis3 server -h
```
```
$ fis3 server open  //打开服务器根目录
$ fis3 init  //脚手架
$ fis3 install //插件安装
$ fis3 release -d ./output  //发布到output目录
$ fis3 release rd   //push 到 RD 的远端机器上
$ fis3 release qa   //push 到 QA 的远端机器上
$ fis3 server start -p 8083  //启动本地服务，端口为8083
```

#fis3的配置方法
* 默认为**fis-conf.js**，FIS3 编译的整个流程都是通过配置来控制的。
* 通过** fis.match(selector, props, !important); **匹配文件。
	* `selector`为匹配规则（glob或者是任意正则）;
	* `props`为操作命令对象;
	* `!important`为设置无法覆盖的参数。
* 通过** fis.media(dev) **接口提供多种状态功能，比如dev、prod、qa、rd等不同环境采用不同的构建配置。
* **::package**(打包)、**::image**(图片)、**::text**(文本，如JS,CSS等)、**:js**(内联JS)、**:css**(内联CSS)。
 ```
// 所有被标注为图片的文件添加 hash
fis.match('::image', {
  useHash: true
})
```

#fis3的配置示例
```
// add md5
fis.match('*.{js,css,png}', {
  useHash: true 
});
// 打包时候启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});
// 对 CSS 进行图片合并splite
fis.match('*.css', {
  useSprite: true,
  //发布到/static/css/xxx目录下
  release : '/static/css$0'
});
// dev阶段的设置
fis.media('dev').match('*', {
    useHash: false,
    optimizer: null
});
```

#fis3构建大致步骤
1. npm install fis3 -g
2. fis3 init
3. npm install //安装依赖
4. 按照fis3的语法编码，如内容嵌入**?__inline**、资源定位**__uri(path)**、** @import url('demo.css');**、依赖声明** @require**
5. 编写fis-conf.js
6. fis3 release -d ./output dev  //用fis.media('dev')的设置，发布到同路径下的output目录
7. fis3 server start -p 8083  //使用内置的server启动本地服务
8. 部署远端服务器，如：
```
fis.media('qa').match('**', {
    deploy:  fis.plugin('http-push', {
        receiver: 'http:///receiver.php',
        to: '/home/work/www'
    })
});
```

#fis3与fis2的区别
* **RoadMap目录定制更简单。**
	* FIS2中roadmap是最先匹配生效的,没有fis.media，FIS3中使用了类似css的配置语法，使用叠加的机制，同一个配置最后一个生效，也可以利用!important禁止覆盖。
* **支持本地插件。**
	* FIS2中插件都需要安装到全局才能使用，不方便自定义插件的开发和部署。FIS3中包括FIS3和插件都可以安装在项目本地使用。插件将优先使用本地的。
* **FIS3支持更好的按需编译。**
	* FIS3中可以通过设置files过滤需要编译的源码，同时支持分析files中引用或依赖到的被过滤的资源目录中的文件。
* etc...