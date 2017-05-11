var msgArr = [];
var giftArr = [];
var msgNum = 1;
var giftNum = 1;

function connectSocket() {
	wx.connectSocket({
		url: "url"
	})
	wx.onSocketOpen(function(res) {
		console.log('WebSocket连接已打开！')
	})
	wx.onSocketError(function(res) {
		console.log('WebSocket连接打开失败，请检查！')
	})
	wx.onSocketMessage(function(res) {
		console.log('收到服务器内容：' + res.data)
	})
}

function closeSocket() {
	wx.closeSocket()
	wx.onSocketClose(function(res) {
		console.log('WebSocket 已关闭！')
	})
}



Page({
	data: {
		// test start
		textNum:1,
		// test end
		bg: "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3Njk0ODY2NTI2MiM1MCNqcGc%3D.jpg&w=640&h=640&s=80&c=0&o=0",
		videoSrc: "http://pullhls99.a8.com/live/1476842081028341/playlist.m3u8",
		display: "show",
		num: "2332",
		id: "343434",
		scrollTop: 0,
		zoom: '',
		translate: '',
		gift: [],
		msg: []
	},
	onLoad: function() {
		// connectSocket()
		//聊天记录
		var self = this;
		setInterval(function() {
			msgArr.push({
				"name": "🌛•张贤静•⚜:",
				"txt": "我是聊天记录我是聊天记记录" + msgNum++
			})
			if (msgArr.length > 30) {
				msgArr.shift();
			}
			self.setData({
				msg: msgArr,
				scrollTop: self.data.scrollTop + 100
			})
		}, 300);
		// 礼物
		setInterval(function() {
			// li动画重置
			self.setData({
				zoom: ''
			});
			// 礼物数量动画重置
			self.setData({
				translate: ''
			});
			giftArr.push({
				"pic": "http://img.meelive.cn/MTQ3MTgyOTQ4NDkzNyM0MDAjanBn.jpg",
				"name": "张贤静张贤静张贤静张贤静张贤静",
				"giftName": "送一个樱花雨2",
				"giftPic": "http://img.meelive.cn/Mjk4NTIxNDQ3MTQ0MjM2.jpg",
				"giftNum": giftNum++
			})
			if (giftArr.length > 1) {
				giftArr.shift();
			}
			self.setData({
				gift: giftArr
			});
			// 动画设置
			self.setData({
				zoom: 'zoom'
			});
			self.setData({
				translate: 'translate'
			});
			// test start
			self.setData({
				textNum: ++self.data.textNum
			});
			// test end
		}, 1000);
	},
	videoErrorCallback: function(e) {
		console.log('视频错误信息:', e.detail.errMsg);
		this.setData({
			display: "hide"
		})
	}
})