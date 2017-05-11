//定义基础对象函数
var base = {
    //根据ID获取DOM对象
    getDom: function(id) {
        return document.getElementById(id);
    },
    //判断浏览器
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
    //事件监听函数
    eventLis: function(o, e, fun) {
        if (window.addEventListener) {
            o.addEventListener(e, fun, false);
        } else if (window.attachEvent) {
            o.attachEvent("on" + e, fun);
        }
    }
};
//ie6,ie7,ie8弹出用高级浏览器的提示
if (base.browser() == "ie6" || base.browser() == "ie7" || base.browser() == "ie8") {
	base.getDom("wrapper").style.display = "block";
    //提示用高级浏览器的弹层函数
    function popup() {
        var closeCover = base.getDom("closeCover");
        var coverPopup = base.getDom("coverPopup");
        coverPopup.style.display = "block";
        closeCover.onclick = function() {
            coverPopup.style.display = "none";
        };
    };
    //删除进度条的DOM
    document.getElementsByTagName("body")[0].removeChild(base.getDom("progressBox"));
	document.getElementsByTagName("body")[0].removeChild(base.getDom("overlay"));
    popup();
} else {  //其他高级浏览器显示页面加载进度条
    //放入图片名称的数组
    var imageSrcArray = ["ico-progress.png", "bg-sun.png", "sun.png", "bg.jpg", "cloud.png", "cloud2.png", "coverIntro.png", "my.png"];
    var i = 0,
    img, len = imageSrcArray.length; //len的值就是要加载的总的图片的数量
    //加载图片的函数
    function imageLoadFun() {
        img = new Image();
        //利用img.load，必须得设置img的src，因为图片都没有src，怎么知道图片是否加载完呢，所以必须得加src
        img.src = "http://www.css119.com/welcomeImg/" + imageSrcArray[i];
        //可以根据加载图片的张数，来实现进度条的实现，每加载完成一张图片，实时的改变进度条
        base.eventLis(img, "load", progress);
        //不加这个判断的话，每加载完一张图片都会执行一次imgLoaded(),img.load并不是所有图片加载完了才执行，而是每张图片加载完都会执行
        if (i == len - 1) {
            base.eventLis(img, "load", imgLoaded);
        }
    };
    //进度条函数
    function progress() {
        //每加载完成一张图片，实时的改变进度条
        var pNum = (i + 1) / len * 100;
        base.getDom("uploadLoading").children[0].style.left = pNum - 100 + "%";
        base.getDom("loadPercent").innerHTML = pNum.toFixed(2) + "%";
        //模拟for循环，这种循环模式可以模拟同步下载效果，即，从头到尾一张一张的下载，而不是像异步那样，下载的顺序无规律
        if (i < len - 1) {
            i++;
            imageLoadFun();
        }
    };
    //图片都加载完成的函数
    function imgLoaded() {
        base.getDom("progressBox").style.display = "none";
        base.getDom("overlay").style.display = "none";
        base.getDom("wrapper").style.display = "block";
    };
    imageLoadFun();
}