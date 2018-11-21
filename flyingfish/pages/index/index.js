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
    num:0,
    classfy:false
  },
  navbarTap: function(e) {
    // console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      directionId: e.currentTarget.dataset.directionId,
      activeid: 0,
      num:e.target.offsetLeft-127
    })
    if (e.currentTarget.dataset.classify.length > 0) {
      this.setData({
        classfyId: e.currentTarget.dataset.classify[0].id,
      })
    } else {
      classfyId: 0
    }
    this.getCurriculum();
  },
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.getname();
    this.getDirection();
    this.getCurriculum();
    this.getBanner()
  },

  getDirection() {
    wx.request({
      url: this.data.feiyu + '/phone/findDirectionAndClass',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
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
  getCurriculum() {
    var directionId = this.data.directionId;
    var classfyId = this.data.classfyId;
    if (classfyId > 0) {
      wx.request({
        url: this.data.feiyu + '/phone/findCourse?directionId=' + directionId + '&classfyId=' + classfyId,
        header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
        success: res => {
          this.setData({
            listdata: res.data
          })
        }
      })
    } else {
      this.setData({
        classfy:true
      })
    }
  },
  getClassifyListId(e) {
    this.setData({
      classfyId: e.detail.val //赋值到父组件的data集合
    })
    this.getCurriculum();
  },
  getBanner() {
    wx.request({
      url: this.data.feiyu + '/phone/findCarouse',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
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