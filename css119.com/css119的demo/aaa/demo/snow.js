$(function() {
    //数量
    var N = 20;
    //图片地址
    var SNOW_IMG = "http://www.css119.com/demo/img/snow15x15.png";
    var Y = new Array();
    var X = new Array();
    var S = new Array();
    var A = new Array();
    var B = new Array();
    var M = new Array();

    var iH = (document.layers) ? window.innerHeight: window.document.body.clientHeight;
    var iW = (document.layers) ? window.innerWidth: window.document.body.clientWidth;
    iH = iH - 50;
    iW = iW - 100;
    for (i = 0; i < N; i++) {
        Y[i] = Math.round(Math.random() * iH);
        X[i] = Math.round(Math.random() * iW);
        S[i] = Math.round(Math.random() * 5 + 2);
        A[i] = 0;
        B[i] = Math.random() * 0.1 + 0.1;
        M[i] = Math.round(Math.random() * 1 + 7);
    }
    var createSnow = function(N) {
        var $tempConatiner = $("<div>");
        for (i = 0; i < N; i++) {
            var clip = Math.round(Math.random() * 1 + 7);
            var $snow = $("<div>");
            $snow.attr({
                name: "sn",
                clip: "0,0," + clip + "," + clip
            }).css({
                left: 0,
                top: 0,
                "background-color": "#FFFFF0",
                "z-index": 900,
                "position": "absolute",
                width: 15 + "px",
                height: 15 + "px",
                "font-size": clip,
                background: "url('" + SNOW_IMG + "') no-repeat"
            }).html("&nbsp;").appendTo($tempConatiner);
        }
        $(document.body).append($tempConatiner.html());
    }
    function snow() {
        var H = (document.layers) ? window.innerHeight: window.document.body.clientHeight;
        var W = (document.layers) ? window.innerWidth: window.document.body.clientWidth;

        var T = (document.layers) ? window.pageYOffset: document.body.scrollTop;
        var L = (document.layers) ? window.pageXOffset: document.body.scrollLeft;
        H = H - 50;
        W = W - 100;

        $("[name='sn']").each(function(i) {
            var sy = S[i];
            var sx = S[i] * Math.cos(A[i]);
            Y[i] += sy;
            X[i] += sx;
            if (Y[i] > H) {
                Y[i] = -10;
                X[i] = Math.round(Math.random() * W);
                M[i] = Math.round(Math.random() * 1 + 7);
                S[i] = Math.round(Math.random() * 5 + 2);
            }
            $(this).css({
                top: Y[i] + T,
                left: X[i]
            });
            A[i] += B[i];
        });

        setTimeout(function() {
            snow();
        },
        40);
    }

    createSnow(N);
    snow();
});