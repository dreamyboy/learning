//index.js
var page=1;
var demoArr = [{
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjM1ODEyMjQ1NiM5MzcjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "❣  刘程      ^_^宝宝",
	"fans": "21256"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjAyNTY0OTQ5MiMyMjUjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "林大美人er",
	"fans": "20055"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjU3MjQ2MjIxMyM3OCNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "平模.bobi😳",
	"fans": "20278"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3MzM0NzA5Mjc3MSMzNTAjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "璐爷",
	"fans": "16845"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjE4NzMxNzE0MiMxNjYjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "范家君🌛",
	"fans": "20038"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjI2MjgwMzc4MSM5NiNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "六月☀️",
	"fans": "17602"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjQzMDk0MTk1MyM5NDUjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "舞世博音-SHIBO",
	"fans": "20112"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjQzMjAxMzc1NiMxMCNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "🍃🍃🍃",
	"fans": "20087"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjEwNzM5NDQzNCM3NDgjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "明宇欧巴",
	"fans": "13827"
}, {
	"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjAzMTgzNDcxNiM2MTYjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
	"name": "biubiubiu💓",
	"fans": "15377"
}];
Page({
	data: {
		head: {
			logo: 'http://img.meelive.cn/NjU5OTgxNDcyMTk3NTQ3.jpg'
		},
		fans: 'http://img.meelive.cn/NzA0ODAxNDY0ODUzOTQ3.jpg',
		isDisplay: 'hide',
		arr: [{
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjM1ODEyMjQ1NiM5MzcjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "❣  刘程      ^_^宝宝",
			"fans": "21256"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjAyNTY0OTQ5MiMyMjUjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "林大美人er",
			"fans": "20055"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjU3MjQ2MjIxMyM3OCNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "平模.bobi😳",
			"fans": "20278"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3MzM0NzA5Mjc3MSMzNTAjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "璐爷",
			"fans": "16845"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjE4NzMxNzE0MiMxNjYjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "范家君🌛",
			"fans": "20038"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjI2MjgwMzc4MSM5NiNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "六月☀️",
			"fans": "17602"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjQzMDk0MTk1MyM5NDUjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "舞世博音-SHIBO",
			"fans": "20112"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjQzMjAxMzc1NiMxMCNqcGc%3D.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "🍃🍃🍃",
			"fans": "20087"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjEwNzM5NDQzNCM3NDgjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "明宇欧巴",
			"fans": "13827"
		}, {
			"pic": "http://image.scale.a8.com/imageproxy2/dimgm/scaleImage?url=http%3A%2F%2Fimg.meelive.cn%2FMTQ3NjAzMTgzNDcxNiM2MTYjanBn.jpg&w=720&h=640&s=80&c=0&o=0",
			"name": "biubiubiu💓",
			"fans": "15377"
		}]
	},
	gotoVideo: function() {
		wx.navigateTo({
			url: "../video/video"
		})
	},
	lower: function() {
		// var self = this;
		// this.setData({
		// 	isDisplay: 'show'
		// })
		// wx.request({
		// 	url: 'test.php',
		// 	success: function(res) {
		// 		this.setData({
		// 			isDisplay: 'hide',
		// 			arr: self.data.arr.concat(res.data);
		// 		})
		// 	}
		// });


		var newArr = this.data.arr.concat(demoArr);
		console.log("page:",page++)
		this.setData({
			isDisplay: 'show',
			arr: newArr
		})
	}
})