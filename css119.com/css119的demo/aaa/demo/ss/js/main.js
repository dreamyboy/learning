define(function(require,exports,module){
    require('./jquery-1.11.0.min.js');
    require('./jquery.imageSlide');
	 $("#imageSlide").imageSlide({evt:0,slideType:1,isAuto:false,speed:2000});
    var x=require('./click');
	 x.a($("#btn"));
});