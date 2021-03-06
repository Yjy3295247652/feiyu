// pages/purchasedCourses/purchasedCourses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feiyu: '',
    listdata: []
  },

  //获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  // 获取购买课程
  getBuyedCourse() {
    wx.request({
      url: this.data.feiyu + '/phone/course/buyedCourse',
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname();
    this.getBuyedCourse();
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