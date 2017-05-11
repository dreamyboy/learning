/*
@plugName: jquery.thumSlide.js
@company: baidu.com
@author: by xudeming208@126.com
@data: 2013-06-08
@blog: http://www.css119.com
@example: 
	$(id).thumSlide({
		//初次显示第几张，从0开始
        index: 0,
        //显示的图片个数
        showNum: 3,
        //每次滚动的图片张数
        slideNum: 1,
        //ul
        ul: "ul",
        //li
        li: "li",
        //上一页的按钮名称
        prev: ".prev",
        //下一页的按钮名称
        next: ".next",
        //焦点样式
        cur: "cur",
        //图片滚动的类型,取值为0代表水平滚动或者1代表竖直滚动
        direction: 0,
        //是否启用图片延迟加载，提高网站初次载入的速度，延迟加载不适用于isMarquee
        lazyLoad: false,
        //延迟加载时，存储真正图片地址的属性名称
        imgSrc: "data-src",
        //是否循环滚动
        isLoop: false,
        //不循环的时候，不能再点击的时候，给按钮添加disable样式的名称
        disable: ["prev-disable", "next-disable"],
        //所有动画执行前的函数
        beforeFun: function() {},
        //是否是连续滚动
        isMarquee: false,
        //是否自动播放
        isAuto: false,
        //滑动的速度
        speed: 500,
        //图片自动滚动的时候，间隔滚动的时间；当isMarquee为true的时候，相当于运行速度,数值越大，滚动的越慢。
        autoTime: 5000
	});
*/

; (function($) {
    /*属性写在构造函数中*/
    function ThumSlide(el, opts) {
        var self = this;
        self.wrap = el;
        self.showNum = opts.showNum;
        self.slideNum = opts.slideNum;
        self.obj = self.wrap.find(opts.ul);
        self.li = self.obj.find(opts.li);
        self.len = self.li.length;
        self.prev = self.wrap.find(opts.prev);
        self.next = self.wrap.find(opts.next);
        self.cur = opts.cur;
        self.disable = opts.disable;
        self.beforeFun = opts.beforeFun;
        self.lazyLoad = opts.lazyLoad;
        self.imgSrc = opts.imgSrc;
        opts.direction == 0 && (self.direction = "left");
        opts.direction == 1 && (self.direction = "top");
        self.isMarquee = opts.isMarquee;
        self.isLoop = opts.isLoop;
        self.isAuto = opts.isAuto;
        self.speed = opts.speed;
        self.autoTime = opts.autoTime;
        self.index = opts.index;
        self.outerWH = 0;
        self.objOuterWh = 0;
        self.objParentOuterWh = 0;
        self.dirObj = {};
        self.timer = null;
        self.dbclicks = false;
        self.slideL = false;
        //执行
        self.init();
    }
    /*方法写在原型中*/
    ThumSlide.prototype = {
        /*初始化*/
        init: function() {
            var self = this;
            self.beforeFun && typeof self.beforeFun == "function" && self.beforeFun();
            self.config();
            self.marqueeSet();
            self.autoPlay();
            self.bind();
        },
        /*配置*/
        config: function() {
            var self = this;
            var w = self.li.outerWidth(true),
              	h = self.li.outerHeight(true);
            //限制index的值的范围
            if (self.index <= 0) {
                self.index = 0;
            } else if (self.index >= self.len) {
                self.index = self.len - 1;
            }
            /*延迟加载的时候添加覆盖loading层*/
            if (self.lazyLoad) {
                for (var n = 0; n < self.len; n++) {
                    self.li.eq(n).append("<div class='loading-cover'></div>");
                }
            }
            //不管是否循环都要初始化外层的宽高
            switch (self.direction) {
            case "left":
                self.outerWH = w;
                self.obj.parent().width(self.showNum * w + "px").height(h);
                self.wrap.width(self.obj.parent().outerWidth(true) + self.prev.outerWidth(true) + self.next.outerWidth(true) + "px").height(self.obj.parent().outerHeight(true));
                break;
            case "top":
                self.outerWH = h;
                self.obj.parent().height(self.showNum * h + "px").width(w);
                self.wrap.height(self.obj.parent().outerHeight(true) + self.prev.outerHeight(true) + self.next.outerHeight(true) + "px").width(self.obj.parent().outerWidth(true));
                break;
            }
            //循环的时候配置
            if (self.isLoop) {
                //clone
                self.obj.children().clone().appendTo(self.obj).clone().prependTo(self.obj);
                //set width or height
                switch (self.direction) {
                case "left":
                    self.obj.width(self.len * w * 3 + "px");
                    break;
                case "top":
                    self.obj.height(self.len * h * 3 + "px");
                    break;
                }
                self.obj.css(self.direction, -(self.len + self.index) * self.outerWH + "px");
                //cur
                var loopLi = self.obj.children();
                self.li.removeClass(self.cur).eq(self.index).addClass(self.cur);
            }
            //不循环时候的配置
            else {
                self.li.removeClass(self.cur).eq(self.index).addClass(self.cur);
                //cur,isMarquee效果时左右键都可点击，是改变滑动方向的作用
                if (!self.isMarquee) {
                    self.index == 0 && self.prev.addClass(self.disable[0]);
                    //防止image-box出现空白
                    if (self.showNum >= self.len - self.index) {
                        self.obj.css(self.direction, -(self.len - self.showNum) * self.outerWH + "px");
                        if (self.showNum >= self.len) {
                            self.prev.addClass(self.disable[0]);
                            self.obj.css(self.direction, "0px");
                        }
                        self.next.addClass(self.disable[1]);
                    } else {
                        self.obj.css(self.direction, -self.index * self.outerWH + "px");
                    }
                }
                //set width or height
                switch (self.direction) {
                case "left":
                    self.obj.width(self.len * w + "px");
                    self.objOuterWh = self.obj.width();
                    self.objParentOuterWh = self.obj.parent().width();
                    break;
                case "top":
                    self.obj.height(self.len * h + "px");
                    self.objOuterWh = self.obj.height();
                    self.objParentOuterWh = self.obj.parent().height();
                    break;
                }
            }
            //获取复制后，所有的li
            self.totalLi = self.obj.children();
            //延迟加载
            if (self.lazyLoad) {
                for (var i = 0; i < self.showNum; i++) {
                    if (self.isLoop) {
                        self.loadImg(self.totalLi.eq(i + self.index + self.len));
                    } else {
                        self.loadImg(self.li.eq( - parseInt(self.obj.css("left")) / self.outerWH + i));
                    }
                }
            }
        },
        /*移动*/
        move: function() {
            var self = this;
            //循环的时候滚动执行
            if (self.isLoop) {
                switch (arguments[0]) {
                    //prev click
                case 1:
                    self.dirObj[self.direction] = -(self.len - self.slideNum + self.index) * self.outerWH + "px";
                    self.obj.stop(true, true).animate(self.dirObj, self.speed,
                    function() {
                        for (var i = 0; i < self.slideNum; i++) {
                            self.obj.children().last().prependTo(self.obj);
                        }
                        //延迟加载
                        self.lazyLoadFun(0);
                        self.dbclicks = false;
                        self.obj.css(self.direction, -(self.len + self.index) * self.outerWH + "px");
                    });
                    break;
                    //next click
                case 2:
                    self.dirObj[self.direction] = -(self.len + self.slideNum + self.index) * self.outerWH + "px";
                    self.obj.stop(true, true).animate(self.dirObj, self.speed,
                    function() {
                        for (var i = 0; i < self.slideNum; i++) {
                            self.obj.children().first().appendTo(self.obj);
                        }
                        //延迟加载
                        self.lazyLoadFun(1);
                        self.dbclicks = false;
                        self.obj.css(self.direction, -(self.len + self.index) * self.outerWH + "px");
                    });
                    break;
                }
            }
            //不循环的时候滚动执行
            else {
                switch (arguments[0]) {
                    //prev click
                case 1:
                    self.index -= self.slideNum;
                    //防止image-box出现空白
                    self.showNum >= self.len - self.index && (self.index = self.len - self.showNum - self.slideNum);
                    if (self.index >= 0) {
                        self.dirObj[self.direction] = -self.index * self.outerWH + "px";
                        self.next.removeClass(self.disable[1]);
                        if (self.index == 0) {
                            self.prev.addClass(self.disable[0]);
                        }
                    } else {
                        self.dirObj[self.direction] = "0px";
                        //恢复self.index
                        self.index = 0;
                        self.next.removeClass(self.disable[1]);
                        self.prev.addClass(self.disable[0]);
                    }
                    self.obj.stop(true, true).animate(self.dirObj, self.speed,
                    function() {
                        //延迟加载
                        self.lazyLoadFun(0);
                        self.dbclicks = false;
                    });
                    break;
                    //next click
                case 2:
                    self.index += self.slideNum;
                    var objParentWh = self.objOuterWh - self.objParentOuterWh;
                    var objDeviation = self.index * self.outerWH;
                    //防止image-box出现空白
                    if (objDeviation <= objParentWh) {
                        self.dirObj[self.direction] = -objDeviation + "px";
                        self.prev.removeClass(self.disable[0]);
                        if (objDeviation == objParentWh) {
                            self.next.addClass(self.disable[1]);
                        }
                    } else {
                        self.dirObj[self.direction] = -objParentWh + "px";
                        //恢复self.index
                        self.index = self.len - self.showNum;
                        self.prev.removeClass(self.disable[0]);
                        self.next.addClass(self.disable[1]);
                    }
                    self.obj.stop(true, true).animate(self.dirObj, self.speed,
                    function() {
                        //延迟加载
                        self.lazyLoadFun(1);
                        self.dbclicks = false;
                    });
                    break;
                }
            }
        },
        /*连续move不循环的时候的配置*/
        marqueeSet: function() {
            var self = this;
            //不循环的时候，让图片从最右侧出来
            if (self.isMarquee && !self.isLoop) {
                self.obj.css(self.direction, self.showNum * self.outerWH + "px");
            }
        },
        /*连续move*/
        marquee: function() {
            var self = this;
            if (self.isMarquee) {
                var offsetLT = parseFloat(self.obj.css(self.direction));
                switch (arguments[0]) {
                    //向右滚动和向下滚动
                case 1:
                    self.dirObj[self.direction] = offsetLT + 2 + "px";
                    self.obj.stop(true, true).animate(self.dirObj, 0,
                    function() {
                        //循环时
                        if (self.isLoop && offsetLT >= 0) {
                            for (var i = 0; i < self.len; i++) {
                                self.obj.children().last().prependTo(self.obj);
                            }
                            self.obj.css(self.direction, -self.len * self.outerWH + "px");
                        }
                        //不循环时,从最左边滚动到最右边，然后再跑到最左边继续slide
                        else if (!self.isLoop && offsetLT >= self.showNum * self.outerWH) {
                            self.obj.css(self.direction, -self.len * self.outerWH + "px");
                        }
                    });
                    break;
                    //向左滚动和向上滚动
                case 2:
                    self.dirObj[self.direction] = offsetLT - 2 + "px";
                    self.obj.stop(true, true).animate(self.dirObj, 0,
                    function() {
                        //循环时
                        if (self.isLoop && offsetLT <= -(self.len - (self.showNum - self.len) / 2) * self.outerWH * 2) {
                            for (var i = 0; i < self.len; i++) {
                                self.obj.children().first().appendTo(self.obj);
                            }
                            self.obj.css(self.direction, -(self.len * 2 - self.showNum) * self.outerWH + "px");
                        }
                        //不循环时,从最右边滚动到最左边，然后再跑到最右边继续slide
                        else if (!self.isLoop && offsetLT <= -self.len * self.outerWH) {
                            self.obj.css(self.direction, self.showNum * self.outerWH + "px");
                        }
                    });
                    break;
                }
            }
        },
        /*加载图片函数*/
        loadImg: function(obj, callback) {
            var self = this;
            if (self.lazyLoad) {
                var o = obj.find("img");
                //图片都加载完成后不再执行下面的方法
                if (o.attr(self.imgSrc)) {
                    var img = new Image();
                    img.src = o.attr(self.imgSrc);
                    img.onload = function() {
                        o.attr("src", img.src).removeAttr(self.imgSrc);
                        obj.find(".loading-cover").remove();
                        callback && typeof callback == "function" && callback();
                    }
                }
            }
        },
        /*延迟加载函数*/
        lazyLoadFun: function(arg) {
            var self = this;
            if (self.lazyLoad) {
                self.totalLi = self.obj.children();
                var thisIndex = null;
                for (var j = 0; j < self.slideNum; j++) {
                    switch (arg) {
                        //prev
                    case 0:
                        if (self.isLoop) {
                            thisIndex = self.len + self.index + j;
                        } else {
                            thisIndex = self.index + j;
                        }
                        break;
                        //next
                    case 1:
                        if (self.isLoop) {
                            thisIndex = self.len + self.index + self.showNum - self.slideNum + j;
                        } else {
                            thisIndex = self.index + self.showNum - self.slideNum + j;
                        }
                    }
                    if (self.isLoop) {
                        self.loadImg(self.totalLi.eq(thisIndex));
                    } else {
                        self.loadImg(self.li.eq(thisIndex));
                    }
                }
            }
        },
        /*自动*/
        autoPlay: function() {
            var self = this;
			clearInterval(self.timer);
            if (self.isAuto) {
                self.timer = setInterval(function() {
                    //向右滚动和向下间接滚动
                    ! self.isMarquee && self.slideL && self.move(1);
                    //向左滚动和向上间接滚动
                    ! self.isMarquee && !self.slideL && self.move(2);
                    //向右滚动和向下连续滚动
                    self.isMarquee && self.slideL && self.marquee(1);
                    //向左滚动和向上连续滚动
                    self.isMarquee && !self.slideL && self.marquee(2);
                },
                self.autoTime);
            }
        },
        /*鼠标事件*/
        bind: function() {
            var self = this;
            self.prev.bind("click",
            function() {
                if (!$(this).hasClass(self.disable[0])) {
                    clearInterval(self.timer);
                    //防止双击
                    ! self.isMarquee && !self.dbclicks && self.move(1);
                    self.isMarquee && !self.isAuto && self.marquee(1);
                    self.dbclicks = true;
                    self.slideL = true;
                }
            });
            self.next.bind("click",
            function() {
                if (!$(this).hasClass(self.disable[1])) {
                    clearInterval(self.timer);
                    //防止双击
                    ! self.isMarquee && !self.dbclicks && self.move(2);
                    self.isMarquee && !self.isAuto && self.marquee(2);
                    self.dbclicks = true;
                    self.slideL = false;
                }
            });
            //循环的时候因为clone了,所以此处不能用self.li
            self.totalLi.bind("click",
            function() {
                //var index=self.li.index(this);
                clearInterval(self.timer);
                self.totalLi.removeClass(self.cur);
                $(this).addClass(self.cur);
            });
            //移上去，清除自动滚动，移开恢复
            self.wrap.hover(function() {
                clearInterval(self.timer);
            },
            function() {
                self.autoPlay();
            });
        }
    };
    //插件
    $.fn.thumSlide = function(options) {
        var opts = $.extend({},$.fn.thumSlide.defaults, options);
        this.each(function() {
            //new构造函数对象
            new ThumSlide($(this), opts);
        });
    };
    /*定义默认值*/
    $.fn.thumSlide.defaults = {
        //初次显示第几张，从0开始
        index: 0,
        //显示的图片个数
        showNum: 3,
        //每次滚动的图片张数
        slideNum: 1,
        //ul
        ul: "ul",
        //li
        li: "li",
        //上一页的按钮名称
        prev: ".prev",
        //下一页的按钮名称
        next: ".next",
        //焦点样式
        cur: "cur",
        //图片滚动的类型,取值为0代表水平滚动或者1代表竖直滚动
        direction: 0,
        //是否启用图片延迟加载，提高网站初次载入的速度，延迟加载不适用于isMarquee
        lazyLoad: false,
        //延迟加载时，存储真正图片地址的属性名称
        imgSrc: "data-src",
        //是否循环滚动
        isLoop: false,
        //不循环的时候，不能再点击的时候，给按钮添加disable样式的名称
        disable: ["prev-disable", "next-disable"],
        //所有动画执行前的函数
        beforeFun: function() {},
        //是否是连续滚动
        isMarquee: false,
        //是否自动播放
        isAuto: false,
        //滑动的速度
        speed: 500,
        //图片自动滚动的时候，间隔滚动的时间；当isMarquee为true的时候，相当于运行速度,数值越大，滚动的越慢。
        autoTime: 5000
    };
})(jQuery)