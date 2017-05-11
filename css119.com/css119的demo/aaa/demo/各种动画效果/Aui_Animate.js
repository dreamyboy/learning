var getStyle = function( obj, attr ){
		try {
			var str = obj.currentStyle[attr];
		} catch(e){
			var str = getComputedStyle( obj, null )[attr];
		};
		return str?str:attr=="opacity"?1:str;
	},
	aUi_Animate = function( obj, json, fn ){
		var sp = 800; // 继续
		obj.setStyle = function(o,t,c,s,a){
			if( a == "opacity" ){
				var r = t-c>s?1:0;
				o.style.filter = "alpha(opacity:"+ ( c + s + r ) +")";
				o.style.opacity = ( c + s + r )/100;
			} else {
				o.style[a] = c+s+"px";
			};
		};
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var bStart = true;
			for(var attr in json){
				var iTarget = parseInt(json[attr]),
					val =  getStyle( obj, attr ),
					iCurr = ( attr == "opacity" ) ? parseInt(parseFloat(val)*100) : parseInt(val=="auto"?0:val),
					Buffer = ( iTarget - iCurr )/(sp/100*2<0?0:sp/100*2),
					iSpeed = Buffer>0 ? Math.ceil(Buffer) : Math.floor(Buffer);
				//console.log((sp/100*2<0?0:sp/100*2))
				if( iTarget != iCurr ){
					bStart = false;
				};
				// setStyle( 对象， 目标值， 当前值， 速度， 属性)
				obj.setStyle( obj, iTarget, iCurr, iSpeed, attr);
			};
			if(bStart){
				clearInterval(obj.timer);
				if(fn) fn();
			};
		},30);
	};