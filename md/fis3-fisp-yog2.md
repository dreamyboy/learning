#**fis3**、**fisp**、**yog2**介绍
***
######作者：徐德明

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

#fisp介绍
* fis-plus 是扩展自FIS(**FIS2**)的前端集成`解决方案`。
* 提供 后端框架、前端框架、自动化工具、辅助开发工具等开发套件。
* 应用于后端是 PHP，模板是 **Smarty** 的场景。
* fis-plus 内置了 **jetty** 服务框架来解析 php 脚本，所以需要安装 **JAVA** 和 **php-cgi**

#fisp的基本命令
```
$ fisp -h
$ fisp release -h
$ fisp server -h
```
```
$ fisp init  //脚手架，如 $ fisp init pc-demo
$ fisp server init  //初始化服务框架,如安装Smarty插件等
	install [pc@latest]
	install [rewrite@latest]
	install [smarty@latest]
	install [fisdata@latest]
$ fisp install //插件安装
$ fisp release -d ./output  //发布到output目录
$ fisp release -m  //启用MD5，注意：FIS3很多功能是配置在fis-conf.js中，而FIS2有些功能是需要CLI处理的
$ fisp release -r common   //发布common目录
$ fisp server start -p 8083  //启动本地服务，端口为8083
$ fisp server info  //查看服务器信息
```
~~**$ fis3 release rd   //FIS2没有fis.media，所以没有此类命令**~~

#fisp的目录规范
```
-site
	-common
		├── fis-conf.js
		├── page
		├── plugin
		├── static
		└── widget
	-home
		├── fis-conf.js
		├── page
		├── server.conf
		├── static
		├── test
		└── widget
	-package.json
```
* page 页面模板tpl
* widget 组件，模板组件，JS组件，CSS组件，会被组件化
* static 这个目录下放一些不需要组件化的公共库，比如lazyload.js
* plugin 这个目录放置的是一些插件，比如Smarty插件
* test 放置一些测试数据，和page下的模板相对应，表明哪个模板用哪个数据文件进行渲染
* server.conf 可配置url转发，可方便在本地模拟ajax请求等。如：
```
rewrite ： 匹配规则后转发到一个文件
template ： 匹配规则后转发到一个模板文件，但url不改变，只针对模板
redirect ： 匹配规则后重定向到另一个url
rewrite ^\/news\?.*tn\=[a-zA-Z0-9]+.* app/data/news.php
template ^\/(.*)\?.*  /home/page/index.tpl
redirect ^\/index\?.* /home/page/index
```
* fis-conf.js配置文件，注意fips采用的是FIS2的语法

#fisp产出目录
* FIS 根据目录规范默认设置了文件的产出路径：
```
└── config
│    └── modulename-map.json    静态资源表
├── template
│    ├──home
│    │   └── page
│    │         └── index.tpl      page级模板文件
│    │   └── widget
│    │         └── section
│    │           └── section.tpl   widget模板文件
├── static
│    └── home
│    │   ├── pkg
│    │   │   ├── demo.css  打包css文件
│    │   │   └── demo.js   打包js文件
│    │   ├── index
│    │   │   ├── index.css  page级css文件
│    │   │   └── index.js   page级js文件
│    │   └── widget             widget组件目录
│    │       └── section
│    │               └── section.css
├── plugin
├── test
```
* 用户根据产出后的目录，只需要将 **config**、**template**、**static**、**plugin** 目录上传至联调机器进行项目联调。

#fisp的模板开发
FIS 提供提供了很多模板插件替换原生 html 标签，为页面模板开发提供使用。
* 通过`html` 插件控制整体页面的输出，以及注册前端组件化框架。
* 通过`head` 插件在模板解析运行时，控制加载同步静态资源使用。
* 通过`body` 插件可在页面底部集中输出JS静态资源。
* 通过`require` 插件加载静态资源，便于静态资源管理。
* 通过`script` 插件管理JS片段，集中在页面底部加载。
* 通过`widget` 插件调用模板组件组织页面，处理对应的静态资源。

###`layout.tpl`，可以了解到如何通过后端框架进行开发，组织整个页面:
```
<!DOCTYPE html>
{%* 使用html插件替换普通html标签，同时注册JS组件化库 *%}
{%html framework="common:static/mod.js" class="expanded"%}
    {%* 使用head插件替换head标签，主要为控制加载同步静态资源使用 *%}
    {%head%}
    <meta charset="utf-8"/>
        <meta content="{%$description%}" name="description">
        <title>{%$title%}</title>
        {%block name="block_head_static"%}{%/block%}
    {%/head%}
    {%* 使用body插件替换body标签，主要为可控制加载JS资源 *%}
    {%body%}
    {%block name="content"%}{%/block%}
    {%/body%}
{%/html%}
```

###`index.tpl`，加载页面模板对应的静态资源，通过模板组件组织页面:
```
{%extends file="common/page/layout.tpl"%}
{%block name="block_head_static"%}
    {%* 模板中加载静态资源 *%}
    {%require name="home:static/lib/css/bootstrap.css"%}
    {%require name="home:static/lib/js/jquery-1.10.1.js"%}
{%/block%}
{%block name="content"%}
    <div id="wrapper">
        <div id="sidebar">
            {%* 通过widget插件加载模块化页面片段，name属性对应文件路径,模块名:文件目录路径 *%}
            {%widget
                name="common:widget/sidebar/sidebar.tpl"
                data=$docs
            %}
        </div>
        <div id="container">
            {%widget name="home:widget/slogan/slogan.tpl"%}
            {%foreach $docs as $index=>$doc%}
                {%widget
                    name="home:widget/section/section.tpl"
                    call="section"
                    data=$doc index=$index
                %}
            {%/foreach%}
        </div>
    </div>
    {%require name="home:static/index/index.css"%}
    {%* 通过script插件收集JS片段 *%}
    {%script%}var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F70b541fe48dd916f7163051b0ce5a0e3' type='text/javascript'%3E%3C/script%3E"));{%/script%}
{%/block%}
```

#fisp构建大致步骤
1. npm install -g fisp
2. fisp init pc-demo  //脚手架，下载pc-demo示例
3. fisp server init  //初始化服务框架,如安装Smarty插件等
4. fisp release -r common/  //发布common目录
5. fisp release -r home/  //发布home目录，一定要先发布common目录
6. fisp server start -p 8687  //启动本地服务，端口为8687
##线上调试
在url加上**fis_debug**参数，即可获取静态资源的独立加载，而不是加载资源包。如：
```
http://localhost:8080/home/page/index?fis_debug
```

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

#THX
