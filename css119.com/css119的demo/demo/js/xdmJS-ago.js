/************************************
作者：徐德明
编写时间：2012年8月3日
博客地址：http://www.css119.com
*************************************/
function $(id) {
    return jQuery(id);
}
var xdmJS = {
    /*最多输入的字符数*/
    totalNum: 1e3,
    /*绑定事件*/
    bindEvent: function(obj, e, fun) {
        if (obj && window.addEventListener) {
            obj.addEventListener(e, fun, false);
        } else if (obj && window.attachEvent) {
            obj.attachEvent("on" + e, fun);
        }
    },
    /*点击返回顶部*/
    backTop: function(btn, speed) {
        /*btn:代表按钮ID
		speed：代表滚动的速度*/
        function isFade() {
            if ($(document).scrollTop() > 0) {
                $(btn).fadeIn();
            } else {
                $(btn).fadeOut();
            }
        }
        isFade();
        $(window).scroll(function() {
            isFade();
        });
        $(btn).unbind("click");
        $(btn).click(function() {
            $("html,body").animate({
                "scrollTop": 0
            },
            speed);
        });
    },
    /*点击显示，点击隐藏*/
    clickHideShow: function(btnShow, btnHide, content) {
        /*btnShow：代表点击显示的按钮
		btnHide：代表点击隐藏的按钮
		content：代表隐藏的主体内容*/

        /*需要显示，又需要隐藏的时候*/
        if (btnShow) {
            $(btnShow).unbind("click");
            $(btnShow).click(function() {
                $(content).fadeIn();
            });
            $(btnHide).unbind("click");
            $(btnHide).click(function() {
                $(content).fadeOut();
            });
        }
        /*只需要隐藏的时候*/
        else {
            $(btnHide).unbind("click");
            $(btnHide).click(function() {
                $(content).fadeOut();
            });
        }
    },
    /*滑上加样式，滑开减样式*/
    hoverClass: function(hoverId, content, className) {
        /*hoverId：代表移上去的按钮
		content：代表要加样式的主体内容
		className：代表要加的样式名称*/

        /*不是给自身添加样式的*/
        if (content) {
            $(hoverId).hover(function() {
                $(content).addClass(className);
            },
            function() {
                $(content).removeClass(className);
            });
        }
        /*给自身添加样式的*/
        else {
            $(hoverId).hover(function() {
                $(this).addClass(className);
            },
            function() {
                $(this).removeClass(className);
            });
        }
    },
    /*选项卡tab函数*/
    tabFun: function(btnWrap, contentId, className) {
        /*btnWrap：代表切换选项卡的按钮的外层
		contentId：代表选项卡对应的主体内容
		className：代表选项卡选中的样式名称*/
        var btnId = $(btnWrap).find("a");
        $(btnId).unbind("click");
        $(btnId).click(function() {
            var index = $(btnId).index($(this));
            $(btnId).removeClass(className).eq(index).addClass(className);
            $(contentId).hide().eq(index).show();
            return false;
        });
    },
    /*input获得焦点的时候清除placeholder水印*/
    inputFocus: function(inputId) {
        /*
		inputId:代表水印的ID;
		*/
        $(inputId).each(function() {
            var self = $(this),
            obj = self.prev("label"),
            placeholder = obj.text();
            self.focus(function() {
                if (self.val() == "") {
                    obj.html("");
                }
            });
            obj.click(function() {
                if (self.val() == "") {
                    obj.html("");
                }
                self.focus();
            });
            self.blur(function() {
                if (self.val() == "") {
                    obj.html(placeholder);
                }
            });
        });
    },
    /*检测字数通用fun*/
    checkWord: function(obj, fun, speed) {
        //部分ie中的onpropertychange事件并不能检测鼠标右键的删除和撤销等事件，opera的oninput事件不能检测直接拖动内容到textarea事件drop&&dragend，故这利用定时器解决
        if (base.browser() == "ie6" || base.browser() == "ie7" || base.browser() == "ie8" || base.browser() == "ie9" || base.browser() == "opera") {
            var timer;
            $(obj).focus(function() {
                timer = setInterval(fun, speed);
            });
            $(obj).blur(function() {
                clearInterval(timer);
            });
        }
        //FF,Chrome,safari等浏览器可以利用oninput事件监听所有的事件，包括keydown,keyup,鼠标右键中的cut，paste和删除，撤销等所有事件，包括直接拖动drop等也支持
        else {
            base.bindEvent(obj, "input", fun);
        }
    },
    /*计算剩余字符,base.remainWord("#textarea","#wordsNum");*/
    remainWord: function(textareaId, remainId) {
        /*
		textareaId:代表textarea的ID;
		remainId:显示剩余字符数的ID;
		*/
        $(textareaId).each(function() {
            var self = $(this),
            remainObj = $(remainId),
            num = 0;
            function fun() {
                num = base.totalNum - self.val().length;
                if (num > 0) {
                    remainObj.css("color", "#828181").html("剩余" + num + "个");
                    self.removeClass("error");
                    if (num == base.totalNum) {
                        remainObj.html("最多" + base.totalNum + "字");
                    }
                } else {
                    remainObj.css("color", "#f00").html("剩余0个");
                    self.addClass("error");
                    //防止ie下输入全部内容后不能ctrl+a全选
                    if (num != 0) {
                        self.val(self.val().substring(0, base.totalNum));
                        //防止输入全部内容后能在前面输入字符，同时删除了后面的字符
                        self.unbind("keydown");
                        self.keydown(function(event) {
                            //排除一些删除按钮和方向按钮等，getTextareaSelectVal是为了当选择textarea一部分内容后，就可以输入内容，否则不能输入，self.val().length >= base.totalNum是为了删除textarea一部分内容后，能够重新输入
                            if (! (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.ctrlKey && event.keyCode == 65 || getTextareaSelectVal()) && self.val().length >= base.totalNum) {
                                return false;
                            }
                        });
                        //防止输入全部内容后用户拖动内容到输入框
                        self[0].ondrop = function() {
                            if (self.val().length >= base.totalNum) {
                                return false;
                            }
                        };
                        //防止输入全部内容后用户鼠标右键粘贴内容到输入框
                        self[0].onpaste = function() {
                            if (self.val().length >= base.totalNum && !getTextareaSelectVal()) {
                                return false;
                            }
                        };
                        //获取所选文本的开始和结束位置
                        function getPositions() {
                            var x = 0,
                            y = 0,
                            val = self[0].value;
                            x = self[0].selectionStart;
                            y = self[0].selectionEnd;
                            return {
                                "val": val,
                                "x": x,
                                "y": y
                            };
                        }
                        //获取textarea中选择的文本
                        function getTextareaSelectVal() {
                            if (window.getSelection) {
                                //Firefox,Chrome,Safari,opera etc
                                return getPositions().val.substring(getPositions().x, getPositions().y).length > 0;
                            } else if (document.selection) {
                                //IE，IE下可以直接获取，不必利用开始和结束位置截取
                                return document.selection.createRange().text.length > 0;
                            }
                        }
                    }
                }
                if (self.val() != "") {
                    self.prev("label").html("");
                }
            }
            base.checkWord(self[0], fun, 100);
        });
    },
    /*截取字符，超过出现省略号,如果文本只有一行的话建议用CSS解决*/
    stringCut: function(stringId, num) {
        /*参数解释:
		stringId:代表需要截取字符的容器的ID;
		num:代表要截取的字符数*/
        var stringId = $(stringId);
        /*循环设置文本*/
        stringId.each(function() {
            var str = $(this).text();
            $(this).attr("title", str);
            if (str.length > num) {
                var newStr = str.substring(0, num) + "...";
                $(this).text(newStr);
            }
        })
    },
    /*判断浏览器,根据函数返回值判定属于什么浏览器,例如判断是否是IE，if(xdmJS.browser()=="ie6"){alert("this is ie6")}*/
    browser: function() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        var bro; (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        //以下判断
        if (Sys.ie) {
            if (Sys.ie == "6.0") {
                bro = "ie6";
            } else if (Sys.ie == "7.0") {
                bro = "ie7";
            } else if (Sys.ie == "8.0") {
                bro = "ie8";
            } else if (Sys.ie == "9.0") {
                bro = "ie9";
            }
        }
        if (Sys.firefox) {
            bro = "firefox";
        }
        if (Sys.chrome) {
            bro = "chrome";
        }
        if (Sys.opera) {
            bro = "opera";
        }
        if (Sys.safari) {
            bro = "safari";
        }
        return bro;
    },
    /*根据原生下拉框的HTML模拟select下拉菜单，宽高自适应，内容多少自适应，同一页里面多个下拉框也能用*/
    selectAnalog: function(selectId, className) {
        /*selectId:代表要使用模拟的select的ID名字或者class名字
			className:代表覆盖默认设置的select-analog的样式及其子孙元素的样式*/
        $(selectId).each(function(index) {
            /*根据select的值创建相应的HTML*/
            var firstHtml = $(this).find("option:first").html();
            var html = "<div class='select-analog";
            if (className) {
                /*如果有覆盖样式的话就加上样式，否则不加*/
                html += " " + className;
            }
            html += "'><a class='title' title='selectAnalog' href='#'>";
            html += firstHtml;
            html += "<b class='arr'></b></a>";
            var htmlUl = $("<ul></ul>");
            var optionLength = $(this).find("option").length;
            for (var i = 0; i < optionLength; i++) {
                var htmlLi = "<li><a href='#'>" + $(this).find("option").eq(i).html() + "</a></li>";
                htmlUl.append(htmlLi);
            }
            html += "<ul>" + htmlUl.html() + "</ul></div>";
            $(this).after(html);
            var selectW = $(this).width();
            var arrWidth = $(".arr").eq(index).width();
            $(this).remove();
            /*对生成的相应的HTML加方法模拟select下拉框*/
            var btnId = $(".select-analog").eq(index).find(".title");
            var ul = $(".select-analog").eq(index).find("ul");
            var arr = "<b class='arr'></b>";
            /*判断浏览器,因为各浏览器对select的宽度取值不一样*/
            if (xdmJS.browser() == "safari") {
                $(btnId).width(selectW + arrWidth + 20);
            } else {
                $(btnId).width(selectW + arrWidth + 2);
            }
            var paddingW = parseInt($(btnId).css("padding-left"));
            ul.width($(btnId).width() + paddingW);
            $(".select-analog").width($(btnId).width() + paddingW);
            $(".select-analog").mouseleave(function() {
                ul.hide();
            });
            $(btnId).unbind("click");
            $(btnId).click(function() {
                $(".select-analog").find("ul").hide().eq(index).show();
                return false;
            });
            ul.find("a").unbind("click");
            ul.find("a").click(function() {
                $(btnId).html($(this).html() + arr);
                ul.hide();
                return false;
            });
        });
    },
    /*图片循环滚动,图片数量自适应,跳跃移上数字时,UL不会一下滚动太多距离*/
    imgScroll: function(imgBox, numBox, ev, speed, stopTime, className) {
        /*参数解释:
		imgBox:代表图片外层的DIV;
		numBox:代表数字外层的DIV;
		ev:代表事件类型，是点击还是hover
		speed:代表滚动动画的速度，数值越大，滚动越慢;
		stopTime:代表图片停留的时间
		className:代表数字选中的样式
		*/
        var imgBox = $(imgBox).find("ul");
        var li = imgBox.find("li");
        var num = $(numBox).find("a");
        var i = 1;
        li.eq(0).clone().appendTo(imgBox);
        /*先把第一个Li复制插入到imgBox里面,方便循环滚动*/
        imgBox.width(li.width() * (li.length + 1));
        /*根据img的数量初始化img UL的宽度，这样Li就可以水平浮动了*/
        /*定义自动滚动函数*/
        function scrollAuto() {
            if (i > li.length) {
                imgBox.css("left", 0);
                i = 1;
            }
            imgBox.animate({
                "left": -li.width() * i
            },
            speed);
            num.removeClass(className).eq(i).addClass(className);
            if (i == li.length) {
                num.removeClass(className).eq(0).addClass(className);
            }
            i++;
        }
        var timer = setInterval(scrollAuto, stopTime);
        /*定义动画函数*/
        function fun() {
            var index = num.index($(this));
            /*移到数字后，先取得上次LI的序号*/
            var prevIndex = num.index($("." + className));
            /*避免跳跃移动数字，图片偏移太多，如从1直接移到8，也能像1移到2效果一样*/
            function delay() {
                li.eq(index).before(li.eq(prevIndex).clone());
                imgBox.stop().css("left", -li.width() * index).animate({
                    "left": -li.width() * (index + 1)
                },
                speed,
                function() {
                    li.eq(index).prev().remove();
                    imgBox.stop().css("left", -li.width() * (index))
                });
                num.removeClass(className).eq(index).addClass(className);
            }
            /*设置延迟响应，避免太过于灵活*/
            delayTimer = setTimeout(delay, 300);
            clearInterval(timer);
        }
        /*移到数字，就显示相应的图片，并停止动画*/
        var delayTimer;
        num.hover(fun(),
        function() {
            i = num.index($(this)) + 1;
            /*当鼠标移开后，显示鼠标停留的图片的下一张图片*/
            timer = setInterval(scrollAuto, stopTime);
            clearTimeout(delayTimer);
        });
        /*移到图片上，就停止动画*/
        li.hover(function() {
            clearInterval(timer);
        },
        function() {
            i = li.index($(this)) + 1;
            /*当鼠标移开后，显示鼠标停留的图片的下一张图片*/
            timer = setInterval(scrollAuto, stopTime);
        });
    },
    /*点击弹出层，点击关闭按钮关闭弹出层*/
    layerShowHide: function(showId, layerName, closeId, locked) {
        /*showId：代表点击弹出层的按钮
		layerName：代表弹出的主体内容
		closeId：代表关闭弹出层的按钮
		locked：为true时代表锁住屏幕，不能滚动,刷新等,必须点击关闭按钮关闭弹出层才能恢复*/

        /*创建弹出层函数*/
        function popup(layerName) {
            if (! (xdmJS.browser() == "ie6")) {
                $("body").append("<div id='Overlay' class='overlay'></div>");
            } else {
                $("body").append("<div id='Overlay' class='overlay overlay-ie6'><iframe frameborder=0 id='frame1'></iframe></div>");
                /*防止出现滚动条时，滚动鼠标页面会闪动*/
                if ($("html").height() < $("body").height()) {
                    $("#Overlay").find("iframe").height($("body").height());
                }
            }
            /* 实现弹出 */
            $("#Overlay").show();
            var od = $(layerName);
            var itop = ($(window).height() - od.outerHeight(true)) / 2;
            var ileft = ($(window).width() - od.outerWidth(true)) / 2;
            if (! (xdmJS.browser() == "ie6")) {
                od.css({
                    "top": itop,
                    "left": ileft,
                    "position": "fixed",
                    "z-index": "9999999"
                }).show();
            } else {
                od.addClass("popup-ie6").show();
            }
        }
        /*是否锁住屏幕，不能滚动，不能刷新等*/
        if (locked) {
            // 遍历
            var each = function(a, b) {
                for (var i = 0,
                len = a.length; i < len; i++) b(a[i], i);
            };
            // 事件绑定
            var bind = function(obj, type, fn) {
                if (obj.attachEvent) {
                    obj['e' + type + fn] = fn;
                    obj[type + fn] = function() {
                        obj['e' + type + fn](window.event);
                    };
                    obj.attachEvent('on' + type, obj[type + fn]);
                } else {
                    obj.addEventListener(type, fn, false);
                };
            };
            // 移除事件
            var unbind = function(obj, type, fn) {
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
            var stopDefault = function(e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            };
            // 获取页面滚动条位置
            var getPage = function() {
                var dd = document.documentElement,
                db = document.body;
                return {
                    left: Math.max(dd.scrollLeft, db.scrollLeft),
                    top: Math.max(dd.scrollTop, db.scrollTop)
                };
            };
            // 锁屏
            var lock = {
                show: function() {
                    var p = getPage(),
                    left = p.left,
                    top = p.top;
                    // 页面鼠标操作限制
                    this.mouse = function(evt) {
                        var e = evt || window.event;
                        stopDefault(e);
                        scroll(left, top);
                    };
                    each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'],
                    function(o, i) {
                        bind(document, o, lock.mouse);
                    });
                    // 屏蔽特定按键: F5, Ctrl + R, Ctrl + A, Tab, Up, Down
                    this.key = function(evt) {
                        var e = evt || window.event,
                        key = e.keyCode;
                        if ((key == 116) || (e.ctrlKey && key == 82) || (e.ctrlKey && key == 65) || (key == 9) || (key == 38) || (key == 40)) {
                            try {
                                e.keyCode = 0;
                            } catch(_) {};
                            stopDefault(e);
                        };
                    };
                    bind(document, 'keydown', lock.key);
                },
                close: function() {
                    each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'],
                    function(o, i) {
                        unbind(document, o, lock.mouse);
                    });
                    unbind(document, 'keydown', lock.key);
                }
            };
        }
        $(showId).unbind("click");
        $(showId).click(function() {
            if (locked) {
                lock.show();
            }
            popup(layerName);
        });
        $(closeId).unbind("click");
        $(closeId).click(function() {
            if (locked) {
                lock.close();
            }
            $(layerName).hide();
            $("#Overlay").remove();
        });
    },
    /*瀑布流布局,如果DOM太多，请不要使用CSS3动画，否则会出现很多bug和性能下降*/
    waterFall: function(wrap, child, margin, isFullScreen) {
        /*wrap：代表瀑布流wrap的ID
		child：代表瀑布流每个元素的ID
		margin：代表每个元素之间的间距
		isFullSreen：代表瀑布流是否全屏*/
        var wrap = $(wrap);
        var child = $(child);
        child.css({
            "position": "absolute"
        });
        var childW = child.eq(0).outerWidth();
        var mar = parseInt(margin);
        /*存放每列高度的数组*/
        var h = [];
        /*一行中child的个数*/
        var n = 0;
        if (isFullScreen) {

            n = Math.floor($(window).width() / (childW + mar));
        } else {
            n = Math.floor(wrap.width() / (childW + mar));
        }
        for (var i = 0; i < child.length; i++) {
            /*先把第一行的定位*/
            if (i < n) {
                h[i] = child.eq(i).outerHeight();
                child.eq(i).css({
                    "left": (childW + mar) * i,
                    "top": 0
                });
            } else {
                /*取得最小高度*/
                var minH = Math.min.apply(null, h);
                var minHIndex = returnMinHIndex(minH, h);
                child.eq(i).css({
                    "left": (childW + mar) * minHIndex,
                    "top": minH + mar + "px"
                });
                /*更新高度值*/
                h[minHIndex] += child.eq(i).outerHeight() + mar;
            }
        }
        /*定义返回最小高度在数组的索引*/
        function returnMinHIndex(x, y) {
            for (z in y) {
                if (y[z] == x) {
                    return z;
                }
            }
        }
        /*全屏的时候，利于屏幕缩放的时候改变布局*/
        if (wrap.width() == $(window).width()) {
            $(window).resize(function() {
                xdmJS.waterFall(wrap, child, margin, isFullScreen);
            });
        }
        /*重置宽度，使其能居中显示*/
        wrap.css({
            "width": (childW + mar) * n - mar,
            "height": Math.max.apply(null, h),
            "margin": margin + " auto",
            "position": "relative"
        });
        /*当有CSS3动画时，解决浏览器的兼容问题*/
        if (xdmJS.browser() == "opera") {
            setTimeout(function() {
                $("body").addClass("opera"); //解决opera的问题，用的是Reflow
            },
            500)
        }
        if (xdmJS.browser() == "safari") {
            setTimeout(function() {
                $(wrap).trigger("resize"); //解决safari的问题，用的是resize
            },
            500)
        }
    }
}