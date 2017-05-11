//宽屏/窄屏
var toggleWidth=function(){
	$(".toggleWidth").toggle(
			function(){$(".wrapper").addClass("fixed");},
			function(){$(".wrapper").removeClass("fixed");}
		);
	}
//板块内的内容的展开与关闭
var section_toggle=function(){
	$(".box_c").find(".slide").toggle(
		function(){$(this).parent("h4").next(".box_c_content").slideUp()},
		function(){$(this).parent("h4").next(".box_c_content").slideDown()}
		);
	}
//板块的移除
var section_remove=function(){
	$(".box_c").find(".hide").click(function(){
			$(this).parents(".box_c").fadeOut();
			});
	}
//backToTop
var backToTop=function(){
	$(".toTop").click(function(){
		$("html,body").animate({"scrollTop":0},1000);
		});
	}
//aside_click
var aside_click=function(){
	$(".aside_menu").find("h3").click(function(){
		if($(this).nextAll("ul").is(":visible")){
				return false;
				}
		else{
			$(".aside_menu").find("h3").removeClass();
			$(this).addClass("active");
			$(".aside_menu>ul>li>ul").slideUp();
			$(this).nextAll("ul").slideDown();
			}
		});
	}
$(function(){
	section_toggle();
	section_remove();
	backToTop();
	aside_click();
	toggleWidth();
	});