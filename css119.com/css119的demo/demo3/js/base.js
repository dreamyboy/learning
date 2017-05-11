/************************************
@company 百度
@author xudeming
@data 2013-04-22
@info 
*************************************/
var base={
	/*点击返回顶部*/
	backTop:function(btn,speed){
		/*btn:代表按钮ID
		speed：代表滚动的速度*/
		function isFade(){
			if($(document).scrollTop()>0){
				$(btn).fadeIn();
			}
			else{
				$(btn).fadeOut();
			}
		}
		isFade();
		$(window).scroll(function(){
			isFade();
			});
		$(btn).click(function(){
			$("html,body").animate({"scrollTop":0},speed);
			});
		},
	/*表格间隔色*/
	tableIntervalColor:function(tableId){
		$(tableId).find("tr:odd").addClass("odd");
		$(tableId).find("tr:even").addClass("even");
		},
	/*点击显示，点击隐藏*/
	clickHideShow:function(btnShow,btnHide,content){
		/*btnShow：代表点击显示的按钮
		btnHide：代表点击隐藏的按钮
		content：代表隐藏的主体内容*/
		
		/*需要显示，又需要隐藏的时候*/
		if(btnShow){
			$(btnShow).click(function(){
				$(content).fadeIn();
			});
		  	$(btnHide).click(function(){
				$(content).fadeOut();
			});
			}
		/*只需要隐藏的时候*/
		else{
			$(btnHide).click(function(){
				$(content).fadeOut();
			});
			}
		},
	/*选项卡tab函数*/
	tabFun:function(btnWrap,contentId,className){
		/*btnWrap：代表切换选项卡的按钮的外层
		contentId：代表选项卡对应的主体内容
		className：代表选项卡选中的样式名称*/
		var btnId=$(btnWrap).find("span");
		$(btnId).click(function(){
			var index=$(btnId).index($(this));
			$(btnId).removeClass(className).eq(index).addClass(className);
			$(btnWrap).find(contentId).hide().eq(index).show();
			return false;
			});
		},
	/*input获得焦点的时候清除placeholder水印,此方法适应无论是input value或者html5 placeholder或者label的值，都可以用*/
	inputFocus:function(inputId){
		/*参数解释:
		inputId:代表水印的ID;
		*/
		function setVal(id,val){
			id.val(val);
			id.attr("placeholder",val);
			id.prev("label").empty();
			}
		/*取得占位符文本*/
		function returnVal(id){
			return id.val()||id.attr("placeholder")||id.prev("label").text();
			}
		$(inputId).each(function(index){
			$(this).css("color", "#999");
			var thisInput=$(inputId).eq(index);
			var placeholder=returnVal(thisInput);
			$(this).focus(function(){
				$(this).css("color", "#000");
				if(returnVal(thisInput)==placeholder){
					setVal(thisInput,"");
					}
				});
			$(this).blur(function(){
				if(returnVal(thisInput)==""){
					setVal(thisInput,placeholder);
					$(this).css("color", "#999");
					}
				else{
					$(this).css("color", "#000");
					}
				});
			})
		},
	/*截取字符，超过出现省略号,如果文本只有一行的话建议用CSS解决*/	
	stringCut:function(stringId,num){
		/*参数解释:
		stringId:代表需要截取字符的容器的ID;
		num:代表要截取的字符数*/
		var stringId=$(stringId);
		/*循环设置文本*/
		stringId.each(function(){
			var str=$(this).text();
			$(this).attr("title",str);
			if(str.length>num){
				var newStr=str.substring(0,num)+"...";
				$(this).text(newStr);
				}
			})
		},
	/*判断浏览器,根据函数返回值判定属于什么浏览器,例如判断是否是IE，if(base.browser()=="ie6"){alert("this is ie6")}*/
	browser:function(){
		var Sys = {}; 
        var ua = navigator.userAgent.toLowerCase(); 
        var s;
		var bro; 
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : 
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : 
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : 
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0; 
        //以下判断
        if (Sys.ie){ 
			if(Sys.ie=="6.0"){
				bro="ie6";
				}
			else if(Sys.ie=="7.0"){
				bro="ie7";
				}
			else if(Sys.ie=="8.0"){
				bro="ie8";
				}
			else if(Sys.ie=="9.0"){
				bro="ie9";
				}
			}
        if (Sys.firefox){
			bro="firefox";
			}
        if (Sys.chrome){
			bro="chrome";
			} 
        if (Sys.opera){
			bro="opera";
			}
        if (Sys.safari){
			bro="safari";
			}
		return bro;
		},
	/*根据原生下拉框的HTML模拟select下拉菜单，宽高自适应，内容多少自适应，同一页里面多个下拉框也能用*/
	selectAnalog:function(selectId,className){
			/*selectId:代表要使用模拟的select的ID名字或者class名字
			className:代表覆盖默认设置的select-analog的样式及其子孙元素的样式*/
			$(selectId).each(function(index){
				/*根据select的值创建相应的HTML*/
				var firstHtml=$(this).find("option:first").html();
				var html="<div class='select-analog";
				if(className){ /*如果有覆盖样式的话就加上样式，否则不加*/
					html+=" "+className;
				}
				html+="'><a class='title' title='selectAnalog' href='#'>";
				html+=firstHtml;
				html+="<b class='arr'></b></a>";
				var htmlUl=$("<ul></ul>");
				var optionLength=$(this).find("option").length;
				for(var i=0;i<optionLength;i++){
					var htmlLi="<li><a href='#'>"+$(this).find("option").eq(i).html()+"</a></li>";
					htmlUl.append(htmlLi);
					}
				html+="<ul>"+htmlUl.html()+"</ul></div>";
				$(this).after(html);
				var selectW=$(this).width();
				var arrWidth=$(".arr").eq(index).width();
				$(this).remove();
				/*对生成的相应的HTML加方法模拟select下拉框*/
				var btnId=$(".select-analog").eq(index).find(".title");
				var ul=$(".select-analog").eq(index).find("ul");
				var arr="<b class='arr'></b>";
				/*判断浏览器,因为各浏览器对select的宽度取值不一样*/
				if (base.browser()=="safari") {
					$(btnId).width(selectW+arrWidth+20);
            		}  
           		else{  
                	$(btnId).width(selectW+arrWidth+2);
            		}
				var paddingW=parseInt($(btnId).css("padding-left"));
				ul.width($(btnId).width()+paddingW);
				$(".select-analog").width($(btnId).width()+paddingW);
				$(".select-analog").mouseleave(function(){
					ul.hide();
					});
				$(btnId).click(function(){
					$(".select-analog").find("ul").hide().eq(index).show();
					return false;
					});
				ul.find("a").click(function(){
					$(btnId).html($(this).html()+arr);
					ul.hide();
					return false;
					});
				});
		},
	/*点击弹出层，点击关闭按钮关闭弹出层*/
	layerShowHide:function(showId,layerName,closeId,locked){
		/*showId：代表点击弹出层的按钮
		layerName：代表弹出的主体内容
		closeId：代表关闭弹出层的按钮
		locked：为true时代表锁住屏幕，不能滚动,刷新等,必须点击关闭按钮关闭弹出层才能恢复*/
		
		/*创建弹出层函数*/
		function popup(layerName) {
			if(!(base.browser()=="ie6")){
				$("body").append("<div id='Overlay' class='overlay'></div>");
				}
			else{
				$("body").append("<div id='Overlay' class='overlay overlay-ie6'><iframe frameborder=0 id='frame1'></iframe></div>");
				/*防止出现滚动条时，滚动鼠标页面会闪动*/
				if($("html").height()<$("body").height()){
					$("#Overlay").find("iframe").height($("body").height());
					}
				}
			/* 实现弹出 */
			$("#Overlay").show();
			var od =$(layerName);
			var itop =(document.documentElement.clientHeight-od.height())/2;
			var ileft =(document.documentElement.clientWidth-od.width())/2;
			if (!(base.browser()=="ie6")) {
				od.css({"top":itop,"left":ileft,"position":"fixed","z-index":"9999999"}).show();
				}
			else {
				od.addClass("popup-ie6").show();
				}
			}
		/*是否锁住屏幕，不能滚动，不能刷新等*/
		if(locked){
			// 遍历
			var each = function(a, b) {
				for (var i = 0, len = a.length; i < len; i++) b(a[i], i);
			};
			// 事件绑定
			var bind = function (obj, type, fn) {
				if (obj.attachEvent) {
					obj['e' + type + fn] = fn;
					obj[type + fn] = function(){obj['e' + type + fn](window.event);}
					obj.attachEvent('on' + type, obj[type + fn]);
				} else {
					obj.addEventListener(type, fn, false);
				};
			};
			// 移除事件
			var unbind = function (obj, type, fn) {
				if (obj.detachEvent) {
					try {
						obj.detachEvent('on' + type, obj[type + fn]);
						obj[type + fn] = null;
					} catch(_) {};
				} else {
					obj.removeEventListener(type, fn, false);
				};
			};
			// 阻止浏览器默认行为
			var stopDefault = function(e){
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
				};
			// 获取页面滚动条位置
			var getPage = function(){
				var dd = document.documentElement,
					db = document.body;
				return {
					left: Math.max(dd.scrollLeft, db.scrollLeft),
					top: Math.max(dd.scrollTop, db.scrollTop)
					};
				};
			// 锁屏
			var lock = {
				show: function(){
					var p = getPage(),
						left = p.left,
						top = p.top;
					// 页面鼠标操作限制
					this.mouse = function(evt){
						var e = evt || window.event;
						stopDefault(e);
						scroll(left, top);
					};
					each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'], function(o, i) {
							bind(document, o, lock.mouse);
					});
					// 屏蔽特定按键: F5, Ctrl + R, Ctrl + A, Tab, Up, Down
					this.key = function(evt){
						var e = evt || window.event,
							key = e.keyCode;
						if((key == 116) || (e.ctrlKey && key == 82) || (e.ctrlKey && key == 65) || (key == 9) || (key == 38) || (key == 40)) {
							try{
								e.keyCode = 0;
							}catch(_){};
							stopDefault(e);
						};
					};
					bind(document, 'keydown', lock.key);
				},
				close: function(){
					each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'], function(o, i) {
						unbind(document, o, lock.mouse);
					});
					unbind(document, 'keydown', lock.key);
				}
			};
		}
		$(showId).click(function(){
			if(locked){
				lock.show();
				}
			popup(layerName);
			});
		$(layerName).find(closeId).click(function(){
			if(locked){
				lock.close();
				}
			$(layerName).hide();
			$("#Overlay").remove();
			});
		},
	/*瀑布流布局,如果DOM太多，请不要使用CSS3动画，否则会出现很多bug和性能下降*/
	waterFall:function(wrap,child,margin,isFullScreen){
		/*wrap：代表瀑布流wrap的ID
		child：代表瀑布流每个元素的ID
		margin：代表每个元素之间的间距
		isFullSreen：代表瀑布流是否全屏*/
		var wrap=$(wrap);
		var child=$(child);
		child.css({"position":"absolute"});
		var childW=child.eq(0).outerWidth();
		var mar=parseInt(margin);
		/*存放每列高度的数组*/
		var h=[];
		/*一行中child的个数*/
		var n=0;
		if(isFullScreen){
			n=Math.floor($(window).width()/(childW+mar));
			}
		else{
			n=Math.floor(wrap.width()/(childW+mar));
			}
		for(var i=0;i<child.length;i++){
			/*先把第一行的定位*/
			if(i<n){
				h[i]=child.eq(i).outerHeight();
				child.eq(i).css({"left":(childW+mar)*i,"top":0});
				}
			else{
				/*取得最小高度*/
				var minH=Math.min.apply(null,h);
				var minHIndex=returnMinHIndex(minH,h);
				child.eq(i).css({"left":(childW+mar)*minHIndex,"top":minH+mar+"px"});
				/*更新高度值*/
				h[minHIndex]+=child.eq(i).outerHeight()+mar;
				}
			}
		/*定义返回最小高度在数组的索引*/
		function returnMinHIndex(x,y){
			for(z in y){
				if(y[z]==x){
					return z;
					}
				}
			}
		/*全屏的时候，利于屏幕缩放的时候改变布局*/
		if(wrap.width()==$(window).width()){
			$(window).resize(function(){
				base.waterFall(wrap,child,margin,isFullScreen);
				});
			}
		/*重置宽度，使其能居中显示*/
		wrap.css({"width":(childW+mar)*n-mar,"height":Math.max.apply(null,h),"margin":margin+" auto","position":"relative"});
		/*当有CSS3动画时，解决浏览器的兼容问题*/
		if(base.browser()=="opera"){
			setTimeout(function(){
				$("body").addClass("opera"); //解决opera的问题，用的是Reflow
				},500)
			}
		if(base.browser()=="safari"){
			setTimeout(function(){
       			$(wrap).trigger("resize");  //解决safari的问题，用的是resize
				},500)
			}
	}
};