//利用canvas将图片分割
function imgSplit(opts) {
	opts = opts || {};
	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	canvas.style.display = 'none';
	var ctx = canvas.getContext('2d'),
		splitNum = opts.splitNum || 3, //splitNum*splitNum
		scale = 0,
		imgWidth = 0,
		imgHeight = 0,
		canvasW = 0,
		canvasH = 0,
		imgArr = [],
		img = new Image();
	//本地预览需要增加此属性(跨域)，node服务器预览不需要
	img.crossOrigin="Anonymous";
	img.onload = function() {
		//防止剪切后的图片的宽和高出现小数
		imgWidth = img.width - img.width % splitNum;
		imgHeight = img.height - img.height % splitNum;
		scale = imgWidth / imgHeight;
		canvasW = imgWidth / splitNum;
		canvasH = imgHeight / splitNum;
		canvas.setAttribute('width', canvasW);
		canvas.setAttribute('height', canvasH);
		for (var i = 0; i < splitNum * splitNum; i++) {
			ctx.drawImage(img, -parseInt(i % splitNum) * canvasW, -parseInt(i / splitNum) * canvasH);
			imgArr.push(canvas.toDataURL('image/jpg'));
		}
		opts.success && typeof opts.success === 'function' && opts.success(imgArr, scale);
	}
	img.onerror = function() {
		opts.error && typeof opts.error === 'function' && opts.error();
	}
	img.src = opts.file;
}

// 将分割好的图片插入DOM
function appendImg(box, imgArr, scale, margin) {
	var frag = document.createDocumentFragment(),
		len = imgArr.length,
		splitNum = Math.sqrt(len),
		//默认图片间隔为1px
		margin = margin || 1,
		marginSum = margin * (splitNum - 1),
		//减去间隙
		styleDomW = parseInt(window.getComputedStyle(box, null).width) - marginSum,
		//之所以减去styleDomW % splitNum是为了不出现小数
		w = (styleDomW - styleDomW % splitNum) / splitNum,
		h = Math.round(w / scale),
		imgWidth = w + 'px',
		imgHeight = h + 'px',
		leftUnit = 0,
		topUnit = 0,
		imgLeft = 0,
		imgTop = 0,
		//重置box的宽度
		boxWidth = w * splitNum + marginSum + 'px',
		boxHeight = h * splitNum + marginSum + 'px';
	//打乱排序
	imgArr.sort(function() {
		return Math.random() > 0.5 ? 1 : -1;
	});
	for (var i = 0; i < len; i++) {
		var imgDom = document.createElement('img');
		imgDom.src = imgArr[i];
		leftUnit = parseInt(i % splitNum);
		topUnit = parseInt(i / splitNum);
		imgLeft = leftUnit * w + leftUnit * margin + 'px';
		imgTop = topUnit * h + topUnit * margin + 'px';
		imgDom.style.cssText += ';width:' + imgWidth + ';height:' + imgHeight + ';left:' + imgLeft + ';top:' + imgTop;
		frag.appendChild(imgDom);
	}
	box.style.cssText += ';width:' + boxWidth + ';height:' + boxHeight + ';margin-left:auto;margin-right:auto;';
	box.appendChild(frag);
}



//

var box = document.getElementById('box');
var opts = {
	'file': 'http://s16.mogucdn.com/new1/v1/bmisc/525e9f2884a5a19979d034fce8702537/176965027813.png',
	'splitNum': 3,
	'success': function(imgArr, scale) {
		appendImg(box, imgArr, scale, 2);
	},
	'error': function() {
		alert('img error');
	}
}
imgSplit(opts);
