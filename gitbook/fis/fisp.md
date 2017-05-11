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

#线上调试
在url加上**fis_debug**参数，即可获取静态资源的独立加载，而不是加载资源包。如：
```
http://localhost:8080/home/page/index?fis_debug
```