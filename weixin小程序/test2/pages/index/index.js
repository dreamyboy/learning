Page( {
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 1000,
    duration: 300,
    iconSize: [ 20, 30, 40, 50, 60, 70 ],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'info', 'warn', 'waiting', 'safe_success', 'safe_warn',
      'success_circle', 'success_no_circle', 'waiting_circle', 'circle', 'download',
      'info_circle', 'cancel', 'search', 'clear'
    ],
    array: [ '美国', '中国', '巴西', '日本' ],
    index: 0,
    date: '2016-09-01',
    time: '12:01'
  },
  formSubmit: function( e ) {
    console.log( 'form发生了submit事件，携带数据为：', e.detail.value )
  },
  formReset: function() {
    console.log( 'form发生了reset事件' )
  },
  bindPickerChange: function( e ) {
    console.log( 'picker发送选择改变，携带值为', e.detail.value )
    this.setData( {
      index: e.detail.value
    })
  },
  bindDateChange: function( e ) {
    this.setData( {
      date: e.detail.value
    })
  },
  bindTimeChange: function( e ) {
    this.setData( {
      time: e.detail.value
    })
  }
})