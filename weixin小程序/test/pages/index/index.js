//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onReady: function() {
    wx.getLocation( {
      type: 'wgs84',
      success: function( res ) {
        console.log( res )
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })


    wx.getNetworkType( {
      success: function( res ) {
        console.log( res )
      }
    })


    wx.getSystemInfo( {
      success: function( res ) {
        console.log( res.model )
        console.log( res.pixelRatio )
        console.log( res.windowWidth )
        console.log( res.windowHeight )
        console.log( res.language )
        console.log( res.version )
      }
    })
  },
  onLoad: function() {
    console.log( 'onLoad' )
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })



  }
})


