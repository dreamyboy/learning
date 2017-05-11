/**
 * 公共方法
 * @company: baidu.com
 * @author: xudeming208@126.com
 * @data: 2013-10-22
 * @blog: http://www.css119.com
 */
function $(id){
  return jQuery(id);	
}
var BASE = BASE || {};
BASE = {
    /**
     * 注册事件侦听器
     * @param {Element} obj 对象
     * @param {String} e 事件类型
     * @param {Function} fun 事件执行的函数
     */
    bindEvent: function(obj, e, fun) {
        if (obj && window.addEventListener) {
            obj.addEventListener(e, fun, false);
        } else if (obj && window.attachEvent) {
            obj.attachEvent("on" + e, fun);
        } else if (obj) {
            obj["on" + e] = fun;
        }
    },
    /**
     * 移除事件侦听器
     * @param {Element} obj 对象
     * @param {String} e 事件类型
     * @param {Function} fun 事件执行的函数
     */
    removeEvent: function(obj, e, fun) {
        if (obj && window.removeEventListener) {
            obj.removeEventListener(e, fun, false);
        } else if (obj && window.detachEvent) {
            obj.detachEvent("on" + e, fun);
        } else if (obj) {
            obj["on" + e] = null;
        }
    },
    /**
     * 阻止默认行为
     * @param event event对象
     */
    preventDefault: function(event) {
        event = event || window.event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    /**
     * 阻止事件冒泡
     * @param event event对象
     */
    stopBubble: function(event) {
        event = event || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    /**
     * 判断浏览器,根据函数返回值判定属于什么浏览器,例如判断是否是IE，if(BASE.browser()=="ie6"){alert("this is ie6")}
     * @param none
     */
    browser: function() {
        var Sys = {},
            ua = navigator.userAgent.toLowerCase(),
            s,
            bro;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
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
    /**
     * 点击返回顶部
     * @param {String} btn 按钮ID
     * @param {Init} speed 滚动的速度
     */
    backTop: function(btn, speed) {
        function isFade() {
            if ($(document).scrollTop() > 0) {
                $(btn).fadeIn();
            } else {
                $(btn).fadeOut();
            }
        }
        isFade();
        $(window).unbind("scroll").scroll(function() {
            isFade();
        });
        $(btn).unbind("click").click(function() {
            $("html,body").animate({
                    "scrollTop": 0
                },
                speed);
        });
    },
    /**
     * 选项卡
     * @param {String} btnWrap 选项卡的按钮的外层ID
     * @param {String} contentId 选项卡对应的主体内容ID
     * @param {String} className 选项卡选中的样式名称
     */
    tabFun: function(btnWrap, contentId, className) {
        var btnId = $(btnWrap).find("a");
        $(btnId).unbind("click").click(function() {
            var index = $(btnId).index($(this));
            $(btnId).removeClass(className).eq(index).addClass(className);
            $(contentId).hide().eq(index).show();
            return false;
        });
    },
    /**
     * input获得焦点的时候清除placeholder水印
     * @param {String} inputId input的ID
     */
    inputFocus: function(inputId) {
        $(inputId).each(function() {
            var self = $(this),
                obj = self.prev("label"),
                placeholder = obj.text();
            self.unbind("focus").focus(function() {
                if (self.val() == "") {
                    obj.html("");
                }
            });
            obj.unbind("click").click(function() {
                if (self.val() == "") {
                    obj.html("");
                }
                self.focus();
            });
            self.unbind("blur").blur(function() {
                if (self.val() == "") {
                    obj.html(placeholder);
                }
            });
        });
    },
    /**
     * 截取字符，超过出现省略号,如果文本只有一行的话建议用CSS解决
     * @param {String} stringId 需要截取字符的容器的ID
     * @param {Init} num 要截取的字符数
     */
    stringCut: function(stringId, num) {
        var stringId = $(stringId);
        //循环设置文本
        stringId.each(function() {
            var str = $(this).text();
            $(this).attr("title", str);
            if (str.length > num) {
                var newStr = str.substring(0, num) + "...";
                $(this).text(newStr);
            }
        })
    },
    /**
     * 计算剩余字符,BASE.remainWord("#textarea","#wordsNum",1000);
     * @param {String} textareaId textarea的ID
     * @param {String} remainId 显示剩余字符数的ID
     * @param {Init} totalNum 总共允许输入的字符数
     */
    remainWord: function(textareaId, remainId, totalNum) {
        $(textareaId).each(function() {
            var self = $(this),
                remainObj = $(remainId),
                num = 0;
            //调用
            checkWord(self[0], main, 100);
            //检测字数函数
            function checkWord(obj, fun, speed) {
                //部分ie中的onpropertychange事件并不能检测鼠标右键的删除和撤销等事件，opera的oninput事件不能检测直接拖动内容到textarea事件drop&&dragend，故这利用定时器解决
                if (BASE.browser() == "ie6" || BASE.browser() == "ie7" || BASE.browser() == "ie8" || BASE.browser() == "ie9" || BASE.browser() == "opera") {
                    var timer;
                    $(obj).unbind("focus").focus(function() {
                        timer = setInterval(fun, speed);
                    });
                    $(obj).unbind("blur").blur(function() {
                        clearInterval(timer);
                    });
                }
                //FF,Chrome,safari等浏览器可以利用oninput事件监听所有的事件，包括keydown,keyup,鼠标右键中的cut，paste和删除，撤销等所有事件，包括直接拖动drop等也支持
                else {
                    BASE.bindEvent(obj, "input", fun);
                }
            }
            //计算的主函数
            function main() {
                num = totalNum - self.val().length;
                if (num > 0) {
                    remainObj.css("color", "#828181").html("剩余" + num + "个");
                    self.removeClass("error");
                    if (num == totalNum) {
                        remainObj.html("最多" + totalNum + "字");
                    }
                } else {
                    remainObj.css("color", "#f00").html("剩余0个");
                    self.addClass("error");
                    //防止ie下输入全部内容后不能ctrl+a全选
                    if (num != 0) {
                        self.val(self.val().substring(0, totalNum));
                        //防止输入全部内容后能在前面输入字符，同时删除了后面的字符
                        self.unbind("keydown").keydown(function(event) {
                            //排除一些删除按钮和方向按钮等，getTextareaSelectVal是为了当选择textarea一部分内容后，就可以输入内容，否则不能输入，self.val().length >= totalNum是为了删除textarea一部分内容后，能够重新输入
                            if (!(event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.ctrlKey && event.keyCode == 65 || getTextareaSelectVal()) && self.val().length >= totalNum) {
                                return false;
                            }
                        });
                        //防止输入全部内容后用户拖动内容到输入框
                        self[0].ondrop = function() {
                            if (self.val().length >= totalNum) {
                                return false;
                            }
                        };
                        //防止输入全部内容后用户鼠标右键粘贴内容到输入框
                        self[0].onpaste = function() {
                            if (self.val().length >= totalNum && !getTextareaSelectVal()) {
                                return false;
                            }
                        };
                    }
                }
                if (self.val() != "") {
                    self.prev("label").html("");
                }
            }
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
        });
    },
    /**
     * 根据原生下拉框的HTML模拟select下拉菜单，宽高自适应，内容多少自适应，同一页里面多个下拉框也能用
     * @param {String} selectId 要使用模拟的select的ID名字或者class名字
     * @param {String} className 覆盖默认设置的select-analog的样式及其子孙元素的样式
     */
    selectAnalog: function(selectId, className) {
        $(selectId).each(function(index) {
            //根据select的值创建相应的HTML
            var firstHtml = $(this).find("option:first").html(),
                html = "<div class='select-analog";
            if (className) {
                //如果有覆盖样式的话就加上样式，否则不加
                html += " " + className;
            }
            html += "'><a class='title' title='selectAnalog' href='#'>";
            html += firstHtml;
            html += "<b class='arr'></b></a>";
            var htmlUl = $("<ul></ul>"),
                optionLength = $(this).find("option").length,
                htmlLi = "",
                i = 0;
            for (; i < optionLength; i++) {
                htmlLi = "<li><a href='#'>" + $(this).find("option").eq(i).html() + "</a></li>";
                htmlUl.append(htmlLi);
            }
            html += "<ul>" + htmlUl.html() + "</ul></div>";
            $(this).after(html);
            var selectW = $(this).width(),
                arrWidth = $(".arr").eq(index).width();
            $(this).hide();
            //对生成的相应的HTML加方法模拟select下拉框
            var btnId = $(".select-analog").eq(index).find(".title"),
                ul = $(".select-analog").eq(index).find("ul"),
                arr = "<b class='arr'></b>";
            //判断浏览器,因为各浏览器对select的宽度取值不一样
            if (BASE.browser() == "safari") {
                $(btnId).width(selectW + arrWidth + 20);
            } else {
                $(btnId).width(selectW + arrWidth + 2);
            }
            var paddingW = parseInt($(btnId).css("padding-left"));
            ul.width($(btnId).width() + paddingW);
            $(".select-analog").width($(btnId).width() + paddingW);
            $(".select-analog").unbind("mouseleave").mouseleave(function() {
                ul.hide();
            });
            $(btnId).unbind("click").click(function() {
                $(".select-analog").find("ul").hide().eq(index).show();
                return false;
            });
            ul.find("a").unbind("click").click(function() {
                $(btnId).html($(this).html() + arr);
                ul.hide();
                return false;
            });
        });
    },
    /**
     * 点击弹出层，点击关闭按钮关闭弹出层
     * @param {String} showId 点击弹出层的按钮Id
     * @param {String} layerName 弹出的主体内容Id
     * @param {String} closeId 关闭弹出层的按钮Id
     * @param {Boolean} locked 为true时代表锁住屏幕，不能滚动,刷新等,必须点击关闭按钮关闭弹出层才能恢复
     */
    layerShowHide: function(showId, layerName, closeId, locked) {
        //创建弹出层函数
        function popup(layerName) {
            if (!(BASE.browser() == "ie6")) {
                $("body").append("<div id='Overlay' class='overlay'></div>");
            } else {
                $("body").append("<div id='Overlay' class='overlay overlay-ie6'><iframe frameborder=0 id='frame1'></iframe></div>");
                //防止出现滚动条时，滚动鼠标页面会闪动
                if ($("html").height() < $("body").height()) {
                    $("#Overlay").find("iframe").height($("body").height());
                }
            }
            //实现弹出
            $("#Overlay").show();
            var od = $(layerName),
                itop = (document.documentElement.clientHeight - od.height()) / 2,
                ileft = (document.documentElement.clientWidth - od.width()) / 2;
            if (!(BASE.browser() == "ie6")) {
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
        //是否锁住屏幕，不能滚动，不能刷新等
        if (locked) {
            //遍历
            var each = function(a, b) {
                for (var i = 0,
                        len = a.length; i < len; i++) b(a[i], i);
            };
            //获取页面滚动条位置
            var getPage = function() {
                var dd = document.documentElement,
                    db = document.body;
                return {
                    left: Math.max(dd.scrollLeft, db.scrollLeft),
                    top: Math.max(dd.scrollTop, db.scrollTop)
                };
            };
            //锁屏
            var lock = {
                show: function() {
                    var p = getPage(),
                        left = p.left,
                        top = p.top;
                    //页面鼠标操作限制
                    this.mouse = function(evt) {
                        var e = evt || window.event;
                        BASE.preventDefault(e);
                        scroll(left, top);
                    };
                    each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'],
                        function(o, i) {
                            BASE.bindEvent(document, o, lock.mouse);
                        });
                    //屏蔽特定按键: F5, Ctrl + R, Ctrl + A, Tab, Up, Down
                    this.key = function(evt) {
                        var e = evt || window.event,
                            key = e.keyCode;
                        if ((key == 116) || (e.ctrlKey && key == 82) || (e.ctrlKey && key == 65) || (key == 9) || (key == 38) || (key == 40)) {
                            try {
                                e.keyCode = 0;
                            } catch (_) {};
                            BASE.preventDefault(e);
                        };
                    };
                    BASE.bindEvent(document, 'keydown', lock.key);
                },
                close: function() {
                    each(['DOMMouseScroll', 'mousewheel', 'scroll', 'contextmenu'],
                        function(o, i) {
                            BASE.removeEvent(document, o, lock.mouse);
                        });
                    BASE.removeEvent(document, 'keydown', lock.key);
                }
            };
        }
        $(showId).unbind("click").click(function() {
            if (locked) {
                lock.show();
            }
            popup(layerName);
        });
        $(layerName).find(closeId).unbind("click").click(function() {
            if (locked) {
                lock.close();
            }
            $(layerName).hide();
            $("#Overlay").remove();
        });
    },
    /**
     * 瀑布流布局,如果DOM太多，请不要使用CSS3动画，否则会出现很多bug和性能下降
     * @param {String} wrap 瀑布流wrap的ID
     * @param {String} child 瀑布流每个元素的ID
     * @param {String} margin 每个元素之间的间距
     * @param {Boolean} isFullScreen 瀑布流是否全屏
     */
    waterFall: function(wrap, child, margin, isFullScreen) {
        var wrap = $(wrap),
            child = $(child),
            childLen = child.length,
            childW = child.eq(0).outerWidth(),
            mar = parseFloat(margin),
            h = [],
            n = 0,
            i = 0;
        child.css({
            "position": "absolute"
        });
        if (isFullScreen) {
            n = Math.floor($(window).width() / (childW + mar));
        } else {
            n = Math.floor(wrap.width() / (childW + mar));
        }
        for (; i < childLen; i++) {
            //先把第一行的定位
            if (i < n) {
                h[i] = child.eq(i).outerHeight();
                child.eq(i).css({
                    "left": (childW + mar) * i,
                    "top": 0
                });
            } else {
                //取得最小高度
                var minH = Math.min.apply(null, h),
                    minHIndex = returnMinHIndex(minH, h);
                child.eq(i).css({
                    "left": (childW + mar) * minHIndex,
                    "top": minH + mar + "px"
                });
                //更新高度值
                h[minHIndex] += child.eq(i).outerHeight() + mar;
            }
        }
        //定义返回最小高度在数组的索引
        function returnMinHIndex(x, y) {
            for (z in y) {
                if (y[z] == x) {
                    return z;
                }
            }
        }
        //全屏的时候，利于屏幕缩放的时候改变布局
        if (wrap.width() == $(window).width()) {
            $(window).unbind("resize").resize(function() {
                BASE.waterFall(wrap, child, margin, isFullScreen);
            });
        }
        //重置宽度，使其能居中显示
        wrap.css({
            "width": (childW + mar) * n - mar,
            "height": Math.max.apply(null, h),
            "margin": margin + " auto",
            "position": "relative"
        });
    }
};