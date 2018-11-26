// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [],
    currentTab: 0,
    listdata: [],
    directionId: 3,
    classfyId: 53,
    banner: [],
    feiyu: '',
    bottomShow: false,
    code: '',
    num: 0,
    classfy: false,
    select: 0,
    ang: 270,
    right: -60,
    clicknumber: 0,
    iszhezhao: "none"
  },
  // 点击遮罩
  clickzhezhao: function() {
    this.setData({
      ang: 270,
      right: -100,
      clicknumber: 0,
      iszhezhao: "none"
    })
  },
  //跳转至已购买页面
  getbought: function(e) {
    var that = this;
    var number = this.data.clicknumber + 1;
    that.setData({
      select: e.currentTarget.dataset.select,
      clicknumber: number
    })

    if (this.data.clicknumber % 2 == 1) {
      this.setData({
        ang: 0,
        right: 20,
        iszhezhao: "block"
      })
    } else if (this.data.clicknumber % 2 == 0) {
      wx.request({
        url: that.data.feiyu + '/phone/course/buyedCourse',
        header: {
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
        },
        method: "GET",
        success: res => {
          this.setData({
            iszhezhao: "none",
            ang: 270,
            right: -100,
            clicknumber: 0
          })
          console.log(res);
          if (res.data.code !== 0) {
            wx.showToast({
              title: '请重新登录',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.code == 0) {
            console.log(this.data.clicknumber);
            setTimeout(function() {
              wx.navigateTo({
                url: '../course/course?select=' + that.data.select,
              }, 1000)
            })
          }
        }
      })
    }
  },
  // 切换方向
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      directionId: e.currentTarget.dataset.directionid,
      activeid: 0,
      num: e.target.offsetLeft - 127
    })
    if (e.currentTarget.dataset.classify.length > 0) {
      this.setData({
        classfyId: e.currentTarget.dataset.classify[0].id,
      })
    } else {
      this.setData({
        classfyId: 0
      })
    }
    this.getCurriculum();
  },
  // 获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },

  // 获取方向
  getDirection() {
    wx.request({
      url: this.data.feiyu + '/phone/course/findDirectionAndClass',
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      success: res => {
        if (res.data && res.statusCode == '200') {
          this.setData({
            navbar: res.data
          })
        }
      }
    })
    this.getCurriculum();
  },
  // 获取课程
  getCurriculum() {
    var classfyId = this.data.classfyId;
    if (classfyId > 0) {
      this.setData({
        classfy: false
      })
      wx.request({
        url: this.data.feiyu + '/phone/course/findCourse?directionId=' + this.data.directionId + '&classfyId=' + this.data.classfyId,
        header: {
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
        },
        success: res => {
          this.setData({
            listdata: res.data
          })
        }
      })
    } else {
      this.setData({
        classfy: true
      })
    }
  },
  // 获取阶段ID
  getClassifyListId(e) {
    this.setData({
      classfyId: e.detail.val //赋值到父组件的data集合
    })
    this.getCurriculum();
  },
  // 获取轮播图
  getBanner() {
    wx.request({
      url: this.data.feiyu + '/phone/course/findCarouse',
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      success: res => {
        if (res.data) {
          this.setData({
            banner: res.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.getDirection();
    this.getCurriculum();
    this.getBanner();
    wx.hideLoading();
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
    console.log(0)
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.stopPullDownRefresh();
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 上拉加载
  loadMore() {

  },
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