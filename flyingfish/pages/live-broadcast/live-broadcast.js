// pages/live-broadcast/live-broadcast.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    feiyu: '',
    navbar: ['视频列表', '课程介绍'],
    currentTab: 0,
    listdata: [],
    courseId: '',
    videoAddress: null,
    flag: true,
    bottomShow: false,
    isChecked: '',
    collectText: 0,
    isBuy:''
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  getVideo(e) {
    this.setData({
      videoAddress: e.currentTarget.dataset.address.video_address,
      flag: !this.data.flag,
      isChecked: e.currentTarget.dataset.id,
    })
    this.getlistdata();
  },
  getlistdata() {
    wx.request({
      url: this.data.feiyu + '/phone/course/course_chapter?courseId=' + this.data.courseId,
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      success: res => {
        if (res.data) {
          this.setData({
            listdata: res.data,
            collectText: res.data.collectflag,
            isBuy: res.data.isBuy
          })
        }
      }
    })
  },
  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  // 获取收藏课程
  getCollectCourse() {
    var that = this;
    wx.request({
      url: this.data.feiyu + '/phone/course/course_collect',
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      data: {
        courseId: that.data.courseId
      },
      success(res) {
        that.setData({
          collectText: true
        })
      }
    })
  },
  // 取消收藏
  unCollect(e) {
    var that = this;
    wx.request({
      url: that.data.feiyu + '/phone/course/course_uncollect',
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      data: {
        courseId: that.data.courseId
      },
      success(res) {
        that.setData({
          collectText: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname();
    this.setData({
      courseId: options.courseId,
      price: options.price
    })
    this.getlistdata();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    this.setData({
      bottomShow: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})