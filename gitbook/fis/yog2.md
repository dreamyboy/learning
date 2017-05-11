#yog2介绍
* YOG2 是一个专注于 `Node.js` UI 中间层的应用框架。它基于 `express` 和 `fis`(默认是FIS2，可以通过`yog2 release prod --fis3 # --fis3 建议跟在所有参数的最后`或者`export YOG_MODE=fis3`配置成FIS3) 开发，在享受 `express` 的灵活扩展能力和 `fis` 强大的前端工程化能力的同时，引入了自动路由、app 拆分以及后端服务管理模块来保证UI中间层的快速开发与稳定可靠。

#yog2的基本命令
```
$ yog2 -h
$ yog2 init -h
$ yog2 release -h
$ yog2 run -h
```
```
//脚手架，快速创建基础框架
$ yog2 init project
//init业务代码，每一个 app 都是一个独立的子项目，包含了这个子项目中所有的前后端代码
//每个 app 均可以独立开发、编译、部署
$ yog2 init app
//启用MD5，注意：yog2默认是FIS2，很多功能是通过CLI方式配置
//当配置成FIS3的时候，需配置fis-conf.js
$ yog2 release -m
//启动框架,默认端口是 8085
//你可以通过修改 PORT 环境变量或者直接修改 app.js 来指定端口
$ yog2 run  
```

#yog2的目录规范
```
├─home
│  ├─client
│  │  ├─page
│  │  ├─static
│  │  └─widget
│  └─server
│      ├─action
│      ├─lib
│      └─model
└─yog
    ├─app
    ├─bin
    ├─conf
    │  ├─plugins
    │  └─ral
    ├─plugins
    ├─static
    └─views
```

###project目录
* project 目录中的 `app` `static` `views` 目录均是通过 **yog2 release**部署生成的，不需要手动修改。
```
├─yog
    ├─app                 # server代码目录
    ├─conf                # 配置目录
    │  ├─plugins          # 插件配置  
    │  └─ral              # 后端服务配置
    ├─plugins             # 插件目录
    ├─static              # 静态资源目录
    ├─views               # 后端模板目录
    └─app.js              # project 启动入口
```

###home目录
```
├─client                 # 前端代码
│  ├─page                # 前端页面
│  ├─static              # 前端非模块化静态资源
│  │  ├─css
│  │  └─js
│  └─widget              # 前端组件
├─fis-conf.js            # FIS编译配置
└─server                 # 后端代码
    ├─action             # Action是指MVC中的路由动作，处理页面请求
    ├─lib                # 可以存放一些通用库
    ├─model              # 可以存放一些数据层代码，如后端API请求等
    └─router.js          # AppRouter路由，用于处理自动路由无法满足的需求
```

#yog2的路由
* YOG2 框架在 `express`的路由基础上，提供了自动路由与多级路由系统。
* YOG2 的路由分为两类。
	* 一类是根路由，其角色与传统的 `Express`路由非常类似，是所有请求的一致入口;
	* 一类是 app 路由，它只能接收根路由分发到各个 app 的请求，请求在 app 中如何分发则可以完全由 app 路由控制。

###yog2路由规则
* 自动路由用于管理url与action之间的映射关系，默认的路由规则为
```
http://www.example.com/home/index => app/home/action/index.js
http://www.example.com/home/doc/detail => app/home/action/doc/detail.js
```
* 如果上述规则没有匹配成功，会尝试匹配同名文件夹下的index.js，即
```
http://www.example.com/home/index => app/home/action/index/index.js
http://www.example.com/home/doc/detail => app/home/action/doc/detail/index.js
```
* 从上述规则我们可以看出，自动路由会将网站第一级目录识别为 app 的名称，会根据这个名称寻找同名的 app 进行转发。而在 app 路由的处理过程中，会根据 action 文件夹下的目录结构进行进一步的转发。

#yog2的MVC

* **控制器**
	* 在 YOG2 中，控制器就是路由系统指向的 `action` 文件,实际上就是 `express` 在路由注册时的回调函数，因此其中的参数 `req` `res` `next` 均可以参考 `express`文档 使用。
* **数据模型**
	* yog2并未内置任何数据库 ORM 功能,但是通过中间件和插件扩展，我们也可以很轻松的引入类似 `waterline` 和 `mongoose` 这类 ORM 库用于数据库的访问。
* **模板引擎**
	* yog2 默认使用了 `swig` 作为模板引擎,同时我们扩展了模版引擎使其能够支持更多的功能，其中最核心的功能就是 FIS 的后端静态资源管理能力。

#yog2的插件系统
* YOG2 插件系统是整个框架的骨架(有一种特殊的插件为中间件，如`http`)。在 YOG2 中，从中间件管理到日志系统和FIS静态资源管理，所有功能的引入都是以插件的形式引入的，因此在了解每个功能的具体用法之前，我们需要对插件系统有一个整体的了解。
* YOG2 插件系统的设计目标是
	* 通过插件系统实现功能与配置的分离
	* 功能由插件自身实现
	* 配置由插件系统统一管理，完全暴露给用户
* 这样设计的优点是我们可以对 yog2 project 的运行时核心进行整体升级，但是其中的功能调整能够对用户在一定程度上是透明的。

#yog2的内置插件
* **dispatcher**
	* 自动路由分发插件，提供全局函数yog.dispatcher
* **http**
	* 中间件管理插件，通过配置，用户可以方便的管理中间件加载顺序和新增中间件
* **log**
	* 日志插件，提供全局函数yog.log
* **ral**
	* 后端服务管理插件，提供全局函数yog.ral
* **views**
	* FIS静态资源管理与模板插件

* **yog2插件依赖**
	* 这样，仅当插件 A 初始化完成后，才会开始插件 B 的初始化工作
```
// plugins/B/index.js
module.exports.B = ['A', function(app, conf){
}];
```
* **yog2插件配置**
	* 插件的配置均存放在 yog2 project 的 `conf/plugins` 文件夹中
```
module.exports.http = {
	middleware: ['log','ral','views']
};
```
* **yog2环境变量支持**
	* YOG2 还支持根据环境变量加载不同的配置，举例来说：`export YOG_ENV=dev`,YOG_ENV 的值将影响配置的加载，比如为dev时，就会优先加载 http.dev.js 而非 http.js。

#yog2的模板
* YOG2通过扩展 `swig` 后端模板引擎，来添加对资源的加载能力。会重写 `html`, `head`, `body` 标签用于搭建资源加载的总体框架，并且添加了 `require`, `widget`, `script` 标签用于处理静态资源和后端组件。
* **基础结构**
	
	* 一个基础的 YOG2 后端模板应该类似

	```
	<!doctype html>
	{% html framework="home:static/js/mod.js" %}
	    {% head %}
	        <title>Hello World</title>
	    {% endhead %}
	    {% body %}
	    {% endbody %}
	{% endhtml %}
	```

* 总的来说，yog2的模板语法和fisp的模板很像，只有细小的区别，对比如下：

	* fisp:

	```
	{%require name="common:static/vendor/bigpipe/lazyload.js"%}
	{%widget name="common:widget/player/footer/footer.tpl"%}
	{%body%}
	{%/body%}
	```
	* yog2:
	```
	{% require "home:static/lib/jquery.js" %}
	{% widget "home:widget/search/search.tpl" with {a=1, b="hello world", c=title} only%}
	{% body %}
    {% endbody %}
	```

#yog2构建大致步骤
1. npm install -g yog2
2. yog2 init project  //脚手架，创建基础的运行框架
3. yog2 init app  //创建应用的业务代码
4. cd project
5. npm install  //安装依赖
6. yog2 run  //启动
7. cd app
8. yog2 release --dest debug //编译和发布
* **`yog2 release –dest debug `必须要求运行框架以调试模式启动后使用，否则无法正确的部署代码。**