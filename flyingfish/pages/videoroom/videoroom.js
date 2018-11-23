function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

// pages/videoroom/videoroom.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    feiyu: '',
    chapterId: '',
    danmuList: [],
    chapter: null,
    commentAndReply: [],
    src: '',
    text: '',
    reply: [],
    replyFlag: false
  },
  //获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  // input失去焦点
  bindInputBlur: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  //发送按钮点击
  bindSendDanmu: function(e) {
    var that = this;
    wx.request({
      url: that.data.feiyu + '/phone/course/course_chapter_comment',
      data: {
        content: that.data.text,
        chapterId: that.data.chapter.id
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      success: function(res) {
        that.getChapterCommentList();
      },
    })
  },
  //获取视频节信息、对应评论和回复
  getChapterCommentList() {
    var that = this;
    if (this.data.chapterId) {
      wx.request({
        url: this.data.feiyu + '/phone/course/chapterCommentList?chapterId=' + this.data.chapterId,
        header: {
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res) {
          if (res.data.code == 0) {
            that.setData({
              chapter: res.data.chapter,
              commentAndReply: res.data.commentAndReply
            })
          } else if (res.data.code == 1) {
            wx.showToast({
              title: '服务器错误',
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请重新选择视频',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname()
    this.setData({
      chapterId: options.videoId
    })
    this.getChapterCommentList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        src: that.data.chapter.video_address
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})