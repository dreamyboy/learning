/*
@plugName: jquery.imageSlide.js
@company: baidu.com
@author: xudeming208@126.com
@data: 2013-10-22
@blog: http://www.css119.com
@example: 
	$(id).imageSlide({
		//初次显示第几张，从0开始
        index: 0,
        //列表框的标签
        ul: "ul",
        //列表标签
        li: "li",
        //图片序列号按钮BOX
        numBox: ".num",
        //上一张按钮
        prev: ".prev",
        //下一张按钮
        next: ".next",
        //数字按钮焦点样式
        cur: "cur",
        //是否自动播放
        isAuto: true,
        //是否启用图片延迟加载，提高网站初次载入的速度
        lazyLoad: false,
        //启用图片延迟加载时，真正图片存贮的属性名称
        imgSrc: "data-src",
        //是否启用预加载，利用数组对象导入图片信息，图片全部加载完成之后才开始轮播幻灯片，之前显示loading图标和完成的百分比,暂时只设定，预加载的时候，标签为UL和LI
        isLoadJSON: false,
        //启用预加载时，存放图片信息的数组，格式为[{"href":"#","imgSrc":"http://www.css119.com/demo/img/imgSlide/i01.jpg","imgTitle":"图片title","imgAlt":"图片alt"}]
        LoadJsonObj: [],
        //是否需要循环轮播，mobile端和纯大新闻展示页较多不循环，故加此参数
        isLoop: true,
        //不循环的时候，不能再点击的时候，给按钮添加disable样式的名称
        disable: ["prev-disable", "next-disable"],
        //是否支持'→'和'←'按键切换图片
        hotKey: true,
        //是否根据图片的数量自动生成系号
        displayNum: true,
        //触发效果的事件，0：hover事件；1：click事件
        evt: 1,
        //特效类型 0：渐变；1:左右滑动；2：上下滑动；
        effect: 1,
        //滑动效果（只对滑动效果有作用） 0：匀速滑动；1：缓冲滑动（越来越慢）;
        slideType: 0,
        //效果时间
        speed: 500,
        //效果间隔时间
        autoTime: 5000
	});
*/

; (function($) {
    /*属性写在构造函数中*/
    function ImageSlide(el, opts) {
        var self = this;
        self.wrap = el;
        self.ul = self.wrap.find(opts.ul);
        self.li = self.ul.find(opts.li);
        self.len = self.li.length;
        self.liWidth = self.li.outerWidth(true);
        self.liHeight = self.li.outerHeight(true);
        self.numBox = self.wrap.find(opts.numBox);
        self.prev = self.wrap.find(opts.prev);
        self.next = self.wrap.find(opts.next);
        self.isAuto = opts.isAuto;
        self.lazyLoad = opts.lazyLoad;
        self.imgSrc = opts.imgSrc;
        self.isLoadJSON = opts.isLoadJSON;
        self.LoadJsonObj = opts.LoadJsonObj;
        self.isLoop = opts.isLoop;
        self.disable = opts.disable;
        self.hotKey = opts.hotKey;
        self.displayNum = opts.displayNum;
        self.cur = opts.cur;
        self.evt = opts.evt;
        self.effect = opts.effect;
        self.slideType = opts.slideType;
        self.speed = opts.speed;
        self.autoTime = opts.autoTime;
        self.index = opts.index;
        self.numBoxB = null;
        self.timer = null;
        self.timer2 = null;
        self.direction = null;
        self.step = null;
        self.dbclicks = false;
        self.moveObj = {};
        self.moveObj2 = {};
        self.prevIndex = 0;
        //执行
        self.init();
    }
    /*方法写在原型中*/
    ImageSlide.prototype = {
        /*初始化*/
        init: function() {
            var self = this;
            self.isLoadJSONFun();
            self.config();
            self.autoPlay();
            self.hotKeyFun();
            self.bind();
        },
        /*配置*/
        config: function() {
            var self = this;
            self.speed = self.speed >= self.autoTime ? self.autoTime - 100 : self.speed;
            //限制index的值的范围
            if (self.index <= 0) {
                self.index = 0;
            } else if (self.index >= self.len) {
                self.index = self.len - 1;
            }
            /*是否显示图片序列号*/
            if (self.displayNum) {
                self.numBox.empty();
                for (var m = 0; m < self.len; m++) {
                    self.numBox.append("<b>" + (m + 1) + "</b>");
                }
            }
            self.numBoxB = self.numBox.children();
            self.numBoxB.eq(self.index).addClass(self.cur);
            /*延迟加载的时候添加覆盖loading层*/
            if (self.lazyLoad) {
                for (var n = 0; n < self.len; n++) {
                    self.li.eq(n).append("<div class='loading-cover'></div>");
                }
            }
            //不循环时添加disable样式
            ! self.isLoop && self.index == 0 && self.prev.addClass(self.disable[0]);
			! self.isLoop && self.index == self.len - 1 && self.next.addClass(self.disable[1]);
            /*延迟加载*/
            self.lazyLoad && self.loadImg(self.index);
            switch (self.effect) {
                //渐变效果
            case 0:
                self.li.hide().eq(self.index).show();
                break;
                //横向滑动
            case 1:
                self.direction = "left";
                self.step = self.liWidth;
                break;
                //垂直滑动
            case 2:
                self.direction = "top";
                self.step = self.liHeight;
                break;
            }
            //滑动共同config
            if (self.effect != 0) {
                self.li.css(self.direction, self.step).eq(self.index).css(self.direction, 0).css("z-index", 10).addClass("prevIndexLi");
            }
            self.moveObj[self.direction] = 0;
        },
        /*动画执行完后的回调函数*/
        moveCallback: function(index) {
            var self = this;
            self.dbclicks = false;
            self.loadImg(index);
        },
        /*移动*/
        move: function() {
            var self = this;
            //防止连续点击多次，动画执行多次
            if (!self.dbclicks) {
                self.prevIndex = self.wrap.find(".prevIndexLi").index();
                //向左运动
                if (arguments[0] == 0) {
                    //不循环的时候
                    if (!self.isLoop) {
                        if (self.index < self.len - 1) {
                            self.index++;
                        } else {
                            clearInterval(self.timer);
                        }
                    }
                    //循环的时候
                    else {
                        self.index < self.len - 1 ? self.index++:self.index = 0;
                    }
                    if (self.effect != 0) {
                        self.moveObj2[self.direction] = -self.step;
                        self.li.eq(self.index).css(self.direction, self.step);
                    }
                }
                //向右运动
                else if (arguments[0] == 1) {
                    if (!self.isLoop && self.index > 0) {
                        self.index--;
                    } else if (self.isLoop) {
                        self.index <= 0 ? (self.index = self.len - 1) : self.index--;
                    }
                    if (self.effect != 0) {
                        self.moveObj2[self.direction] = self.step;
                        self.li.eq(self.index).css(self.direction, -self.step);
                    }
                } else {
                    if (self.prevIndex < self.index) {
                        self.moveObj2[self.direction] = -self.step;
                        self.effect != 0 && self.li.eq(self.index).css(self.direction, self.step);
                    } else {
                        self.moveObj2[self.direction] = self.step;
                        self.effect != 0 && self.li.eq(self.index).css(self.direction, -self.step);
                    }
                }
				self.li.removeClass("prevIndexLi").eq(self.index).addClass("prevIndexLi");
                switch (self.effect) {
                    //渐变效果
                case 0:
                    self.li.stop(true, true).fadeOut(self.speed).eq(self.index).fadeIn(self.speed,
                    function() {
                        self.moveCallback(self.index);
                    });
                    self.numBoxB.removeClass(self.cur).eq(self.index).addClass(self.cur);
                    break;
                    //滑动效果
                case 1:
                case 2:
                    //滑动类型（只对滑动效果有作用） 0：匀速滑动；1：缓冲滑动（越来越慢）;
                    switch (self.slideType) {
                    case 0:
                        self.li.eq(self.prevIndex).stop(true, true).animate(self.moveObj2, self.speed);
                        self.li.eq(self.index).stop(true, true).animate(self.moveObj, self.speed,
                        function() {
                            self.moveCallback(self.index);
                        });
                        break;
                    case 1:
                        self.moving(self.li.eq(self.index), 0, arguments[0],
                        function() {
                            self.moveCallback(self.index);
                        });
                        break;
                    }
                    self.numBoxB.removeClass(self.cur).eq(self.index).addClass(self.cur);
                    if (self.isLoop && self.index == self.len) {
                        self.numBoxB.removeClass(self.cur).eq(0).addClass(self.cur);
                    }
                    break;
                }
                //不循环的时候每动画一次，判断改变样式
                if (!self.isLoop) {
                    self.prev.removeClass(self.disable[0]);
                    self.next.removeClass(self.disable[1]);
                    self.index == 0 && self.prev.addClass(self.disable[0]);
                    self.index == self.len - 1 && self.next.addClass(self.disable[1]);
                }
            }
        },
        /*定义缓冲滑动函数*/
        moving: function(obj, space, dir, callback) {
            var self = this;
            //此效果下，speed最小为200
            self.speed = self.speed > 200 ? self.speed: 200;
            var space = parseInt(space),
            iSpeed = 0,
            Buffer = 0,
            offset = 0,
            prevIndexSpace = 0;
            clearInterval(self.timer2);
			if (dir != 0 && dir != 1) {
			    if (self.prevIndex < self.index) {
			        self.li.not(self.li.eq(self.prevIndex)).css(self.direction, self.step);
			    } else {
			        self.li.not(self.li.eq(self.prevIndex)).css(self.direction, -self.step);
			    }
			}
            self.timer2 = setInterval(function() {
                self.direction == "left" && (offset = obj[0].offsetLeft);
                self.direction == "top" && (offset = obj[0].offsetTop);
                Buffer = (space - offset) / (self.speed / 100);
                iSpeed = Buffer > 0 ? Math.ceil(Buffer) : Math.floor(Buffer);
                if (offset == space) {
					clearInterval(self.timer2);
                    obj.css(self.direction, offset).end().css(self.direction, self.step);
                    callback && typeof callback == "function" && callback();
                }
                obj.css(self.direction, offset + iSpeed);
                var timeSpace = parseFloat(obj.css(self.direction));
                if (dir == 0) {
                    prevIndexSpace = timeSpace - self.step;
                } else if (dir == 1) {
                    prevIndexSpace = timeSpace + self.step;
                } else {
                    if (self.prevIndex < self.index) {
                        prevIndexSpace = timeSpace - self.step;
                    } else {
                        prevIndexSpace = timeSpace + self.step;
                    }
                }
                self.li.eq(self.prevIndex).css(self.direction, prevIndexSpace);
            },
            30);
        },
        /*加载图片函数*/
        loadImg: function(index, callback) {
            var self = this;
            if (self.lazyLoad) {
                var o = self.li.eq(index).find("img");
                //图片都加载完成后不再执行下面的方法
                if (o.attr(self.imgSrc)) {
                    var img = new Image();
                    img.src = o.attr(self.imgSrc);
                    img.onload = function() {
                        o.attr("src", img.src);
                        o.removeAttr(self.imgSrc);
                        self.li.eq(index).find(".loading-cover").remove();
                        callback && typeof callback == "function" && callback();
                    }
                }
            }
        },
        /*是否启用预加载，利用JSON对象导入图片信息，图片全部加载完成之后才开始轮播幻灯片，之前显示loading图标和完成的百分比*/
        isLoadJSONFun: function() {
            var self = this;
            if (self.isLoadJSON) {
                //既然开启了预加载，就把延迟加载去掉
                self.lazyLoad = false;
                //添加cover层
                self.wrap.append("<div id='allLoadCover' class='loading-cover' style='z-index:9999999'><p id='loadPercent' class='loadPercent'>00.00%</p></div>");
                var i = 0,
                imgLen = self.LoadJsonObj.length,
                html = "",
                img, imageSrcArray = [];
                //暂时只设定，预加载的时候，标签为UL和LI
                for (var j = 0; j < imgLen; j++) {
                    //没有图片说明信息的时候
                    html += "<li><a href='" + self.LoadJsonObj[j].href + "' target=_blank'" + "'><img src='" + self.LoadJsonObj[j].imgSrc + "' alt='" + self.LoadJsonObj[j].imgAlt + "' title='" + self.LoadJsonObj[j].imgTitle + "'></a></li>";
                    //放入图片名称的数组
                    imageSrcArray.push(self.LoadJsonObj[j].imgSrc);
                }
                //插入DOM
                self.wrap.prepend("<ul>" + html + "</ul>");
                //重新赋值
                self.ul = self.wrap.find("ul");
                self.li = self.ul.find("li");
                self.len = self.li.length;
                self.liWidth = self.li.outerWidth(true);
                self.liHeight = self.li.outerHeight(true);
                //加载图片的函数
                function imageLoadFun() {
                    img = new Image();
                    //可以根据加载图片的张数，来实现进度条的实现，每加载完成一张图片，实时的改变进度条
                    img.onload = progress;
                    //不加这个判断的话，每加载完一张图片都会执行一次imgLoaded(),img.load并不是所有图片加载完了才执行，而是每张图片加载完都会执行
                    if (i == imgLen - 1) {
                        img.onload = function() {
                            progress();
                            imgLoaded();
                        }
                    }
                    //http://www.css119.com/archives/1658
                    setTimeout(function() {
                        img.src = imageSrcArray[i];
                    },
                    300);
                };
                //进度条函数
                function progress() {
                    //每加载完成一张图片，实时的改变进度条
                    var pNum = (i + 1) / imgLen * 100;
                    self.wrap.find("#loadPercent").html(pNum.toFixed(2) + "%");
                    //模拟for循环，这种循环模式可以模拟同步下载效果，即，从头到尾一张一张的下载，而不是像异步那样，下载的顺序无规律
                    if (i < imgLen - 1) {
                        i++;
                        imageLoadFun();
                    }
                };
                //图片都加载完成的函数
                function imgLoaded() {
                    self.wrap.find("#allLoadCover").remove();
                };
                imageLoadFun();
            }
        },
        /*是否支持'→'和'←'按键切换图片的函数*/
        hotKeyFun: function() {
            var self = this;
            if (self.hotKey) {
                document.onkeydown = function(e) {
                    var e = e || window.event,
                    key = e.keyCode;
                    if (key == 37 && !self.dbclicks) {
						clearInterval(self.timer);
                        //不是同一张照片的时候才执行动画
                        ! self.isLoop && self.index != 0 && self.move(1);
                        self.isLoop && self.move(1);
                        self.dbclicks = true;
                    } else if (key == 39 && !self.dbclicks) {
						clearInterval(self.timer);
						! self.isLoop && self.index != self.len - 1 && self.move(0);
                        self.isLoop && self.move(0);
                        self.dbclicks = true;
                    }
                };
                document.onkeyup = function(e) {
                    var e = e || window.event,
                    key = e.keyCode;
                    if (key == 37 || key == 39) {
                        self.autoPlay();
                    }
                };
            }
        },
        /*自动*/
        autoPlay: function() {
            var self = this;
			clearInterval(self.timer);
            if (self.isAuto) {
                self.timer = setInterval(function() {
                    self.move(0);
                },
                self.autoTime);
            }
        },
        /*定义移上相应元素停止自动效果的函数*/
        hoverStop: function(hoverObj) {
            var self = this;
            hoverObj.hover(function() {
                clearInterval(self.timer);
            },
            function() {
                self.autoPlay();
            });
        },
        /*鼠标事件*/
        bind: function() {
            var self = this;
            self.hoverStop(self.li);
            /*hover事件*/
            if (self.evt == 0) {
                //hover事件的时候隐藏左右按键
                self.prev.hide();
                self.next.hide();
                //移到数字显示相应图片
                var delayTime;
                self.numBoxB.hover(function() {
                    clearInterval(self.timer);
                    //不是同一张照片的时候才执行动画
                    if (!$(this).hasClass(self.cur)) {
                        self.index = self.numBoxB.index(this);
                        /*设置延迟响应，避免太过于灵活*/
                        delayTime = setTimeout(function() {
                            self.move();
                        },
                        200);
                    }
                },
                function() {
                    clearTimeout(delayTime);
                    self.autoPlay();
                });
            }
            /*click事件*/
            else if (self.evt == 1) {
                self.hoverStop(self.numBoxB);
                self.hoverStop(self.prev);
                self.hoverStop(self.next);
                self.numBoxB.click(function() {
                    //不是同一张照片的时候才执行动画
                    if (!$(this).hasClass(self.cur)) {
                        self.index = self.numBoxB.index(this);
                        self.move();
                    }
                });
                self.prev.click(function() {
                    //不循环的时候，防止到最后点击时还执行动画
                    if (!$(this).hasClass(self.disable[0])) {
                        self.move(1);
                        self.dbclicks = true;
                    }
                });
                self.next.click(function() {
                    if (!$(this).hasClass(self.disable[1])) {
                        self.move(0);
                        self.dbclicks = true;
                    }
                });
            }
        }
    };
    //插件
    $.fn.imageSlide = function(options) {
        var opts = $.extend({},
        $.fn.imageSlide.defaults, options);
        this.each(function() {
            //new构造函数对象
            new ImageSlide($(this), opts);
        });
    };
    /*定义默认值*/
    $.fn.imageSlide.defaults = {
        //初次显示第几张，从0开始
        index: 0,
        //列表框的标签
        ul: "ul",
        //列表标签
        li: "li",
        //图片序列号按钮BOX
        numBox: ".num",
        //上一张按钮
        prev: ".prev",
        //下一张按钮
        next: ".next",
        //数字按钮焦点样式
        cur: "cur",
        //是否自动播放
        isAuto: true,
        //是否启用图片延迟加载，提高网站初次载入的速度
        lazyLoad: false,
        //启用图片延迟加载时，真正图片存贮的属性名称
        imgSrc: "data-src",
        //是否启用预加载，利用数组对象导入图片信息，图片全部加载完成之后才开始轮播幻灯片，之前显示loading图标和完成的百分比,暂时只设定，预加载的时候，标签为UL和LI
        isLoadJSON: false,
        //启用预加载时，存放图片信息的数组，格式为[{"href":"#","imgSrc":"http://www.css119.com/demo/img/imgSlide/i01.jpg","imgTitle":"图片title","imgAlt":"图片alt"}]
        LoadJsonObj: [],
        //是否需要循环轮播，mobile端和纯大新闻展示页较多不循环，故加此参数
        isLoop: true,
        //不循环的时候，不能再点击的时候，给按钮添加disable样式的名称
        disable: ["prev-disable", "next-disable"],
        //是否支持'→'和'←'按键切换图片
        hotKey: true,
        //是否根据图片的数量自动生成系号
        displayNum: true,
        //触发效果的事件，0：hover事件；1：click事件
        evt: 1,
        //特效类型 0：渐变；1:左右滑动；2：上下滑动；
        effect: 1,
        //滑动效果（只对滑动效果有作用） 0：匀速滑动；1：缓冲滑动（越来越慢）;
        slideType: 0,
        //效果时间
        speed: 500,
        //效果间隔时间
        autoTime: 5000
    };
})(jQuery)