function $id(id){return document.getElementById(id);}
var durl="www.mb5u.com";
$(function(){ 
//去掉链接虚线
$('a,input[type="button"],input[type="submit"],input[type="radio"]').bind('focus',function(){ if(this.blur){ this.blur();  };});
//顶部导航
$(".sf-menu li").hover(function () {$(this).addClass("hover");  $(this).children("ul").addClass("hover");},function () {  $(this).removeClass("hover");  $(this).children("ul").removeClass("hover");}); 
//帮助
$("#t_a").click( function () { 
var temp= $("#t_b").is(":hidden");if(temp){$("#t_b").slideDown(100);$("#t_a").addClass("on");$("#t_a").text("隐藏帮助");} else{	$("#t_b").slideUp(100);$("#t_a").removeClass("on");$("#t_a").text("查看帮助");}});
$('<div class="zzgj_fa"><a id="zzgj_topfa_in" class="in" title="返回首页" href="http://www.css119.com">WEB前端开发</a><a class="go2top" href="#top" style="display:none;" title="返回顶部">返回顶部</a></div>').appendTo("body");
$(".go2top").click(function(){$(".go2top").hide();$("html,body").animate({scrollTop:0},200);return false});
$(window).scroll(function(){var A=jQuery(".go2top");if(A.offset().top>600){A.show();}else{A.hide()}});
});
function iC(ipt){
ipt.onfocus=function(){if(this.value==this.defaultValue){this.value='';this.style.color='#000';}};
ipt.onblur=function(){if(this.value==''){this.value=this.defaultValue;this.style.color='#666';}};
ipt.onfocus();}
function copyText(B){
	if(document.all){	textRange=$id(B).createTextRange();	textRange.execCommand("Copy");	alert("\u4ee3\u7801\u590d\u5236\u6210\u529f\uff01")}	
	else{
		alert("您的浏览器不支持直接复制,请 CTRL+C 手动复制!");}
	}
function clear(str){

str = str.replace(/<script.*>.*<\/script>/ig,"");
str = str.replace(/<style.*>.*<\/style>/ig,"");
str = str.replace(/<[^>]+>/g,"");//html
str = str.replace(/&nbsp;/ig,'');//去掉&nbsp;
str = str.replace(/\s/ig,'');//空格

return str;
}
function isurl(strUrl) {
    var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
    if (regular.test(strUrl)) {
        return true;
    }
    else {
		alert("请输入正确的网址!");
        return false;
    }
}
function to(url,input_obj){
   if(arguments[2]=="alexa"){
	    var site=input_obj.value;
	    if(!isurl(site)){return;}
	    site=site.toLowerCase();
	    site=site.replace("http://","");
	    site=site.split("/");
	    window.open("http://www.css119.com/alexa_"+ site[0]);
   }else if(arguments[2]=="query"){
	    var site=input_obj.value;
		if(!isurl(site)){return;}
	    site=site.toLowerCase();
		site=site.replace("http://","");
		site=site.split("/");
		window.open("http://www.css119.com/"+ site[0]);
   }else{
	    if(!isurl(input_obj.value)){return;}
        window.open(url+ input_obj.value);
   }
}

function to(url,input_obj){
   if(arguments[2]=="alexa"){
	    var site=input_obj.value;
	    if(!isurl(site)){return;}
	    site=site.toLowerCase();
	    site=site.replace("http://","");
	    site=site.split("/");
	    window.open("http://www.css119.com/alexa_"+ site[0]);
   }else if(arguments[2]=="query"){
	    var site=input_obj.value;
		if(!isurl(site)){return;}
	    site=site.toLowerCase();
		site=site.replace("http://","");
		site=site.split("/");
		window.open("http://www.css119.com/"+ site[0]);
   }else{
	    if(!isurl(input_obj.value)){return;}
        window.open(url+ input_obj.value);
   }
}
//网站收录
function GetEngineRecord(domain,engine)
{
	$.ajax({
	   type: "POST",
	   url: "/action/engine_record.php",
	   //timeout:"3000",//跳出时间
	   data: 'action=engine&engine='+engine+'&domain=' + domain+"&"+Math.random(),
	   beforeSend: function(html){$("#"+engine+"0").html(engine);$("#"+engine+"1,#"+engine+"2").html("<img src='/css/load.gif'/>");},
	   success: function(html){
		  div=html.split("<td>");for(i=0;i<div.length;i++){ $("#"+engine+i+"").html(div[i]);}
		   },
	   error: function(html){ $("#"+engine+"0").html(engine);$("#"+engine+"1,#"+engine+"2").html("<a href=\"javascript:GetEngineRecord('"+domain+"','"+engine+"')\">重查</a>"); }
	}); 
}
//反向链接
function GetEngineLink(domain,engine)
{
	$.ajax({
	   type: "POST",
	   url: "/action/engine_link.php",
	   //timeout:"3000",//跳出时间
	   data: 'action=link&engine='+engine+'&domain=' + domain+"&"+Math.random(),
	   beforeSend: function(html){$("#"+engine+"10,#"+engine+"20").html("<img src='/css/load.gif'/>");},
	   success: function(html){div=html.split("<td>");for(i=0;i<div.length;i++){ $("#"+engine+i+"0").html(div[i]);}},
	   error: function(html){ $("#"+engine+"00").html(engine);$("#"+engine+"10,#"+engine+"20").html("<a href=\"javascript:GetEngineLink('"+domain+"','"+engine+"')\">重查</a>"); }
	}); 
}


//百度权重
function Getbdqz(domain,engine)
{
   $.ajax({
	   type: "POST",
	   url: "/action/baiduqz.php",
	   //timeout:"3000",//跳出时间
	   data: 'action=bdqz&engine='+engine+'&domain=' + domain+"&"+Math.random(),
	   beforeSend: function(html){$("#"+engine+"1,#"+engine+"2,#"+engine+"3,#zhqz").html("<img src='/css/load.gif'/>");},
	   success: function(html){
		   if(engine=="zhqz"){$("#zhqz").html(html);}else{
		   div=html.split("<td>");for(i=0;i<div.length;i++){ $("#"+engine+i+"").html(div[i]);}}
		   },



	   error: function(html){ $("#"+engine+"0").html(engine);$("#"+engine+"1,#"+engine+"2,#"+engine+"3,#zhqz").html("<a href=\"javascript:Getbdqz('"+domain+"','"+engine+"')\">重查</a>"); }
	}); 
}
//百度总收录
function GetBaiduSite(i,domain)
{
  	$.ajax({
	   type: "POST",
	   url: "/action/links.php",
	   //timeout:"3000",//跳出时间
	   data: "action=links_baidu&domain="+domain+"&"+Math.random(),
	    beforeSend: function(html){ $("#b"+i).html("<img src='/css/load.gif'/>");},
	   success: function(html){
		 $("#b"+i).html(html);
	   },
	   error: function(html){
		 $("#b"+i).html("<a href=\"javascript:GetBaiduSite("+i+",'"+domain+"')\">重查</a>");
	   }
	}); 
}
//百度本周收录
function GetBaiduSiteDay(i,domain)
{  
   $.ajax({
	   type: "POST",
	   url: "/action/baiduindextime.php",
	   //timeout:"3000",//跳出时间
	   data: "t=1&action=BaiduSiteDay&domain="+domain+"&"+Math.random(),
	   beforeSend: function(html){ $("#bt"+i).html("<img src='/css/load.gif'/>");},
	   success: function(html){
		 $("#bt"+i).html(html);
	   },
	   error: function(html){
		 $("#bt"+i).html("<a href=\"javascript:GetBaiduSiteDay("+i+",'"+domain+"')\">重试</a>");
	   }
	}); 
}
//获取PR
function GetGooglePR(i,domain)
{  
      $.ajax({
	   type: "POST",
	   url: "/action/links.php",
	   //timeout:"3000",//跳出时间
	   data: "action=links_pr&domain="+domain+"&"+Math.random(),
	   beforeSend: function(html){ $("#p"+i).html("<img src='/css/load.gif'/>");},
	   success: function(html){ $("#p"+i).html(html);},
	   error: function(html){ 
	   $("#p"+i).html("<a href=\"javascript:GetGooglePR("+i+",'"+domain+"')\">重试</a>");
	   }
	}); 
}
//是否回链
function GetFanLink(i,href,domain)
{
	 $.ajax({
	   type: "POST",
	   url: "/action/links.php",
	   //timeout:"3000",//跳出时间
	   //cache:false,
	   data: "action=links_info&url="+domain+"&domain=" + href+"&"+Math.random(),
	   beforeSend: function(html){ $("#i"+i).html("<img src='/css/load.gif'/>");},
	   success: function(html){
		 $("#i"+i).html(html);
	   },
	   error: function(html){
		 $("#i"+i).html("<a href=\"javascript:GetFanLink("+i+",'"+href+"','"+domain+"')\">查询超时,重查</a>");
	   }
	}); 
}
//alexa图表
function get_alexa_map(url){
	var time = document.getElementById('time').value;
	var type_group = document.getElementsByName('type');
	var type_value = null;
	for (var i = 0; i < type_group.length; i++) {
		if (type_group[i].checked) {
			type_value = type_group[i].value;
		}
	}
	var map_api = 'http://traffic.alexa.com/graph?w=700&h=260&r='+time+'&y='+type_value+url;
	document.getElementById('map').src = map_api;
}
//PR值
function GetPR(i,domain)
{  
$.ajax({
	   type: "POST",
	   url: "/action/getpr.php",
	   //timeout:"3000",//跳出时间
	   //cache:false,
	   data: "action=pr&domain=" + domain+"&"+Math.random(),
	   beforeSend: function(html){ $("#pr_"+i).html("<img src='/css/load.gif'/>");},
	   success: function(html){
		 $("#pr_"+i).html(html);
	   },
	   error: function(html){
		 $("#pr_"+i).html("<a href=\"javascript:GetPR("+i+",'"+domain+"')\">重试</a>");
	   }
	}); 
}

//cookies 修改版
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
     	options.expires='99999';
        var date;
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
		var path = ';path=/';
        var domain = ';domain=.mb5u.com';
        var secure = options.secure ? '; secure': '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


function Displayc() {
	var acook = $.cookie('allSites');
	
	if ($('#cHdl')[0].style.display == 'none' && (acook!=null&&acook.length>0)) {
		$('#cHdl')[0].style.display = '';
		$('.j_ico a').addClass("on"); 
	}
}
function changeListBgColor(obj, s) {
	if (s == 1) {
		obj.style.backgroundColor='#EDF6FB';
	
	} else {
		obj.style.backgroundColor='#fff';
	}
}

function SetInputValue(id, str){
	$('#'+id).val(str);
	$('#cHdl')[0].style.display='none';
	$('.j_ico a').removeClass("on"); 
}
function FillAllSites(id) {
	var durl1 = $.cookie('siteallSite');
	if(durl1!=null){durl=durl1;}//最后查询记录
	if($("#"+id+"").val()==''){$("#"+id+"").attr("value",durl);}
	
	var allSites = $.cookie('allSites');
	var boxhtml = '';
	if (allSites) {
		var allSitesA = allSites.split('|');
		for (i = 0; i < allSitesA.length; i++) {
			var tmpArr = allSitesA[i].split(',');
			var tmpSite = tmpArr[0];
			var tmpState = tmpArr[1];
			
			if (allSitesA[i].indexOf(',1') >= 0) {
				boxhtml += "<li class=\"lis\" onmouseover=\"changeListBgColor(this, 1)\" onmouseout=\"changeListBgColor(this, 0)\"><span onclick=\"SetInputValue('key', '"+tmpSite+"')\" class=\"list_span_select\">" + tmpSite + "</span><input type=\"button\" onclick=\"DelAllSitesItem('"+tmpSite+"')\" class=\"list_span_cancel\" value=\"删除\"></span></li>";
			} else if (allSitesA[i].indexOf(',-1') >= 0) {
		
			} else {
				boxhtml += "<li class=\"lis\" onmouseover=\"changeListBgColor(this, 1)\" onmouseout=\"changeListBgColor(this, 0)\"><span onclick=\"SetInputValue('key', '"+tmpSite+"')\" class=\"list_span_select\">" + tmpSite + "</span><input type=\"button\" onclick=\"DelAllSitesItem('"+tmpSite+"')\" class=\"list_span_delte\" value=\"删除\"></span></li>";
			}
			
		}
	}
	$("#cookies").html(boxhtml);
}
function DelAllSitesItem(value) {
	var newSites = [];
	var allSites = $.cookie('allSites');
	var allSitesA = allSites.split('|');
	for (i = 0; i < allSitesA.length; i++) {
		var tmpArr = allSitesA[i].split(',');
		var tmpSite = tmpArr[0];
		var tmpState = tmpArr[1];

		if (value != tmpSite){
			newSites.push(allSitesA[i]);
		}
	}
	if (newSites.length > 0) {
		allSites = newSites.join('|');
	} else {
		allSites = null;
		$('#cHdl')[0].style.display = 'none';
		$('.j_ico a').removeClass("on"); 
	}
	$.cookie('allSites', allSites);
	FillAllSites();
}


$(document).mousedown(
	function(event){
		if (event.target.id != 'site' && event.target.parentNode.className != 'lis' && $('#cHdl')[0].style.display != 'none') {
			$('#cHdl')[0].style.display = 'none';
			$('.j_ico a').removeClass("on"); 
		}
	}
);

function getdomain(url) {
	_url = url.toLowerCase(); 
    if (_url.indexOf("http://") >= 0) {
	    var _url = url.replace("http://", "");
	}
    if (_url.indexOf("/") >= 0) {
		var _domain_arr = _url.split("/");
		var _domain = _domain_arr[0];
	} else {
		var _domain = _url;
	}
	_domain = $.trim(_domain);
	_domain = _domain.replace(" ", "");
    return _domain;
}

function sss(id){
	var query_domain = getdomain($("#"+id+"").val());
	if(isurl(query_domain))
	{
			$.cookie('siteallSite', escape(query_domain)); 
			var allSites = $.cookie('allSites');
			if (!allSites) {
				$.cookie('allSites', escape(query_domain)); 
			} 
			else {
				var newSites = [];
				var allSitesA = allSites.split('|');
				for (i = 0, j = 0; i < allSitesA.length; i++) {
					if (query_domain != allSitesA[i]){
						newSites.push(allSitesA[i]);
						if (j >= 8){
							break;
						}
						j++;
					}
				}
				if (newSites.length > 0) {allSites = escape(query_domain)+'|'+newSites.join('|');} 
				else {allSites = escape(query_domain);}
				
				$.cookie('allSites', allSites); 
			}
	return true;
	}
		
	else {
		 $("#"+id+"").focus();
		 return false;
	}
	
	
	}
	
//屏蔽错误JS
function ResumeError() { return true; } 
window.onerror = ResumeError;



function OnPaste(e) {
    var obj = e.target ? e.target : e.srcElement;
    setTimeout("MoveHttp('" + obj.id + "')", 100);
}
function MoveHttp(id) {
    var val = getid(id).value;
    val = val.replace("http://", "");
    var temp = val.split('/');
    if (temp.length <= 2) {
        if (val[val.length - 1] == '/') {
            val = val.substring(0, val.length - 1);
        }
    }
    getid(id).value = val;
}