function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  onReady: function(res) {
    this.videoContext = wx.createVideoContext('myVideo')
    
  },
  
  inputValue: '',
  data: {
    content: [],
    feiyu: '',
    src: '',
    asd: null
  },
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  geta() {
    var that = this;
    wx.request({
      url: this.data.feiyu + '/phone/course/chapterCommentList?chapterId=144',
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      success(res) {
        console.log(res.data)
        that.setData({
          asd: res.data.chapter
        })
        console.log(that.data.asd)
      }
    })
  },
  onLoad: function () {
    this.getname();
    this.geta();
    
  },
  onShow:function(){
    var that = this;
    setTimeout(function () {
      console.log(that.data.asd)
      that.setData({
        src: that.data.asd.video_address
      })
    }, 500)
  },
  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    });
    this.setData({
      content: this.inputValue
    })
  }
})