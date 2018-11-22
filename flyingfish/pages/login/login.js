// pages/login/login.js
const app = getApp()
const query = wx.createSelectorQuery()

// 倒计时事件 单位s
var countdown = 60;
var settime = function(that) {
  if (countdown == 0) {
    that.setData({
      codeIsCanClick: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      codeIsCanClick: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function() {
    settime(that)
  }, 1000)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true,
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
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
      setTimeout(function(){
        that.setData({
          qwer: true
        })
      },400)
      var openId = wx.getStorageSync("openId")
      if (openId) {
        wx.reLaunch({
          url: '../index/index',
        })
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
              wx.setStorageSync("sessionId", res.data.sessionId);
              wx.setStorageSync("openId", res.data.openId);
              if (res.data.code == 0 && res.data.data == true) {
                wx.reLaunch({
                  url: '../index/index',
                })
              } else if (res.data.code == 0 && res.data.data == false) {
                that.setData({
                  hasUserInfo: false
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
  getPhoneNumber(e) {
    var that = this;
    this.setData({
      phoneNumber: e.detail
    })
    if (that.data.phoneNumber) {
      wx.request({
        url: that.data.feiyu + '/phone/login/afterWeChatPhone',
        data: {
          encrypt: e.detail
        },
        header: {
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == 0) {
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
  getVerificationCode() {
    if (this.data.phoneNumber == undefined || this.data.phoneNumber == null || this.data.phoneNumber == '') {
      wx.showToast({
        title: '手机号不能为空，请输入手机号',
        icon: 'none'
      })
    } else {
      settime(this);
      wx.request({
        url: this.data.feiyu + '/phone/login/register_sms?jbPhone=' + this.data.phoneNumber,
        header: {
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res) {
          wx.showToast({
            title: '验证码发送成功',
          })
        }
      })
    }
  },
  formSubmit: function(e) {
    var that = this;
    that.setData({
      smsCode: e.detail.value.verCode
    })
    if (e.detail.value.phone == undefined || e.detail.value.phone == null || e.detail.value.phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    } else if (e.detail.value.verCode == undefined || e.detail.value.verCode == null || e.detail.value.verCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    } else {
      wx.request({
        url: that.data.feiyu + '/phone/login/bindPhone?smsCode=' + that.data.smsCode,
        header: {
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res) {
          console.log(res)
          if (res.data.code == 1) {
            wx.showToast({
              title: '手机号绑定失败',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
            wx.reLaunch({
              url: '../index/index',
            })
          } else if (res.data.code == 0) {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    }

  },
  formReset: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname();
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