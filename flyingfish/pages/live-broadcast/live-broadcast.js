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
    bottomShow: false,
    videoId: '',
    collectText: false,
    isBuy: '',
    imaSrc: ''
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
  // 去播放视频
  getVideo(e) {
    this.setData({
      videoId: e.currentTarget.dataset.id,
    })
    wx.navigateTo({
      url: '/pages/videoroom/videoroom?videoId=' + this.data.videoId,
    })
  },
  // 获取视频列表信息
  getlistdata() {
    if (this.data.price) {
      var openId = wx.getStorageSync("openId")
      if (openId) {
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
      } else {
        wx.reLaunch({
          url: '../login/login',
        })
      }
    } else {
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
    }
  },
  // 收藏课程
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
        wx.showToast({
          title: '收藏成功',
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
        wx.showToast({
          title: '已取消收藏',
          icon: 'none'
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '飞鱼学院',
      path: '/pages/live-broadcast/live-broadcast?isshare=1',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  goIndex(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.isshare == 1) {
      console.log('是分享进入');
    }
    this.setData({
      courseId: options.courseId,
      price: options.price
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getname();
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
    var that = this
    setTimeout(function() {
      that.setData({
        imgSrc: that.data.feiyu + '/' + that.data.listdata.course.course_image_address
      })
    }, 400)
    wx.hideLoading()
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
    this.getlistdata();
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500)
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