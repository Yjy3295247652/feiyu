// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feiyu: '',
    code: '',
    userInfomation: null,
    isSignIn: "签到",
    qwer: null,
    integral: 0
  },
  //获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  // 签到
  qiandao: function(e) {
    var that = this;
    if (e._relatedInfo.anchorTargetText == "已签到") {
      wx.showToast({
        title: '今日已签到',
      })
    } else if (e._relatedInfo.anchorTargetText == "签到") {
      that.setData({
        qwer: true
      })
      wx.request({
        url: that.data.feiyu + '/phone/login/personSignIn',
        header: {
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
        },
        success(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '签到成功，加20积分',
            })
            that.setData({
              isSignIn: "已签到"
            })
            that.getUserInfomation();
          } else {
            wx.showToast({
              title: '签到失败，请重新签到',
              icon: "none"
            })
            that.setData({
              isSignIn: "签到"
            })
          }
        }
      })
      setInterval(function() {
        that.setData({
          qwer: false
        })
      }, 800)
    }
  },
  // 检查是否签到
  checkQiandao() {
    var that = this;
    wx.request({
      url: that.data.feiyu + '/phone/login/isSignIn',
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      success(res) {
        if (res.data.code == 0 && res.data.isSignIn == true) {
          that.setData({
            isSignIn: "已签到"
          })
        } else if (res.data.code == 0 && res.data.isSignIn == false) {
          that.setData({
            isSignIn: "签到"
          })
        } else if (res.data.code == 1) {
          wx.showToast({
            title: '服务器错误！',
            icon: 'none'
          })
        }
      }
    })
  },
  // 获取用户信息
  getUserInfomation() {
    var openId = wx.getStorageSync("openId");
    var that = this;
    if (openId) {
      wx.request({
        url: this.data.feiyu + '/phone/login/personal_basic',
        header: {
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
        },
        success(res) {
          console.log(res.data)
          that.setData({
            userInfomation: res.data.userInfo,
            integral: res.data.integral.integralNumber
          })
        }
      })
    } else {
      that.setData({
        userInfomation: {
          nickname: "游客",
          head_image: ""
        },
        integral: 0
      })
    }
  },
  // 点击判断是否去登录
  toLogin(e) {
    if (e._relatedInfo.anchorTargetText == "游客") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../install/install',
      })
    }
  },
  checkIsLogin(){
    var openId = wx.getStorageSync("openId")
    if(openId){

    }else{
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkIsLogin();
    this.getname();
    this.getUserInfomation();
    this.checkQiandao();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})