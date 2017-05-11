// JavaScript Document
$(function(){
	$("#form_login").validate({
		rules:{  				//定义规则
			lusername:{
				required:true
				},
			lpassword:{
				required:true
				}
			},
		messages:{  			//定义出错提示信息
			lusername:{
				required:"用户名不能为空"
				},
			lpassword:{
				required:"密码不能为空"
				}
			},
		errorElement: 'p',  // 放置错误信息的元素，可以是其他的。
		errorPlacement:function(error,element){  //控制错误信息放置的位置
				error.prependTo(element.parent())
			}
	});
	})