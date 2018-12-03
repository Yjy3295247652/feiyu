// pages/login/login.js
const app = getApp()
const query = wx.createSelectorQuery()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    code: 0,
    isPhone: '',
    smsCode: null,
    codeIsCanClick: true,
    encrypt: '',
    phoneNumber: '',
    qwer: null
  },
  //获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  //获取用户公开信息
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
      setTimeout(function() {
        that.setData({
          qwer: true
        })
      }, 400)
      var openId = wx.getStorageSync("openId")
      var userId = wx.getStorageSync("userId")
      if (openId) {
        if (userId != ''){
          wx.reLaunch({
            url: '../index/index',
          })
        }else{
          this.isLogin();
        }
      } else {
        this.isLogin();
      }
    } else {
      wx.showToast({
        title: '请授权我们的小程序',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
  },
  // 用户登录
  isLogin() {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.data.feiyu + '/phone/login/afterWeChatLogin',
            data: {
              code: res.code,
              userInfo: that.data.userInfo
            },
            success(res) {
              wx.setStorageSync("openId", res.data.openId);
              wx.setStorageSync("userId", res.data.userId);
              wx.setStorageSync("userName", res.data.userName);
              wx.setStorageSync("userInfoId", res.data.userInfoId);
              wx.setStorageSync("session_key", res.data.session_key);
              if (res.data.code == 0 && res.data.data == true) {
                wx.reLaunch({
                  url: '../index/index',
                })
              } else if (res.data.code == 0 && res.data.data == false) {
                that.setData({
                  hasUserInfo: true
                })
              } else if (res.data.code = 1) {
                wx.showToast({
                  title: '服务器错误！',
                  icon: 'none',
                  mask: true,
                })
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            mask: true,
          })
        }
      }
    })
  },
  //用户绑定手机号
  getPhoneNumber(e) {
    var that = this;
    this.setData({
      phoneNumber: e.detail
    })
    if (that.data.phoneNumber) {
      wx.request({
        url: that.data.feiyu + '/phone/login/afterWeChatPhone',
        data: {
          encrypt: e.detail,
          session_key: wx.getStorageSync("session_key")
        },
        header: {
          "openId": wx.getStorageSync("openId"),
          "userId": wx.getStorageSync("userId"),
          "userInfoId": wx.getStorageSync("userInfoId"),
          "userName": wx.getStorageSync("userName")
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == 0) {
            wx.setStorageSync("userId", res.data.userId);
            wx.setStorageSync("userName", res.data.userName);
            wx.reLaunch({
              url: '../index/index',
            })
          } else {

          }
        }
      })
    } else {

    }
  },
  //判断是否登录
  judgementState(){
    var openId = wx.getStorageSync('openId')
    var userId = wx.getStorageSync('userId')
    if(openId && userId != ''){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }else if(openId && userId == ''){
      this.setData({
        qwer:true,
        hasUserInfo:true
      })
    }else if(!openId && userId == ''){
      this.setData({
        qwer:false,
        hasUserInfo:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname();
    this.judgementState()
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