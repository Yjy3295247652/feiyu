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
    imaSrc: '',
    manImgSrc: '',
    isPopping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {}, //item位移,透明度
    animInput: {}, //item位移,透明度
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
    });
    wx.request({
      url: this.data.feiyu + '/phone/course/saveStudyByCourse',
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      data: {
        courseId: this.data.courseId,
        chapterId: e.currentTarget.dataset.id
      },
      success: res => {
        if(res.data.code == 0){
          wx.navigateTo({
            url: '/pages/videoroom/videoroom?videoId=' + this.data.videoId,
          })
        }else if(res.data.code == 1){
          wx.showToast({
            title: '加入学习失败',
            icon:'none'
          })
          wx.navigateTo({
            url: '/pages/videoroom/videoroom?videoId=' + this.data.videoId,
          })
        }
      }
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
            "openId": wx.getStorageSync("openId"),
            "userId": wx.getStorageSync("userId"),
            "userInfoId": wx.getStorageSync("userInfoId"),
            "userName": wx.getStorageSync("userName")
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
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
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
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
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
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
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
  onShareAppMessage: function() {
    return {
      title: '飞鱼学院',
      path: '/pages/live-broadcast/live-broadcast?isshare=1',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //点击弹出
  plus: function() {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  input: function() {
    console.log("input")
  },
  transpond: function() {
    console.log("transpond")
  },
  collect: function() {
    console.log("collect")
  },

  //弹出动画
  popp: function() {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.translate(-25, -10).step();
    animationcollect.translate(-30, -65).rotateZ(360).opacity(1).step();
    animationTranspond.translate(-75, -55).rotateZ(360).opacity(1).step();
    animationInput.translate(-85, -20).rotateZ(360).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function() {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.translate(0, 0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  goIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //立即购买
  toBuy() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: 'MD5',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      courseId: options.courseId,
      price: options.price
    })
    wx.showLoading({
      title: '正在加载',
    })

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
    this.getname();
    this.getlistdata();
    var that = this
    setTimeout(function() {
      that.setData({
        imgSrc: that.data.feiyu + '/' + that.data.listdata.course.course_image_address,
        manImgSrc: that.data.feiyu + '/' + that.data.listdata.teacher.teacher_image
      })
    }, 500)
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