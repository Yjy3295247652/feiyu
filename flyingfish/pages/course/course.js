// pages/course/course.js
var time = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    selected1: "",
    selected2: "",
    selected3: "",
    cla: 0,
    coursedata: [],
    collectcourse: {
      courseId: 0,
      coursePrice: 0,
      courseImage: "",
      courseName: "",
      endTime: "",
      student_count: 0,
      level: 0,
    },
    page: 1,
    total: 1
  },
  // 获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  //获取不同分类效果
  getswitch: function(e) {
    switch (e) {
      case 1:
        {
          var that = this;
          wx.showLoading({
            title: '正在加载',
            success: res => {
              wx.setNavigationBarTitle({
                title: '正在学习'
              });
              that.setData({
                selected1: "selected",
                coursedata: []
              });
              this.getstudying();
            }
          })

          break;
        }
      case 2:
        {
          var that = this;
          wx.showLoading({
            title: '正在加载',
            success: res => {
              that.setData({
                selected2: "selected",
                coursedata: []
              });
              wx.setNavigationBarTitle({
                title: '已购课程'
              });
              that.getbought();
            }
          })

          break;
        }
      case 3:
        {
          var that = this;
          wx.showLoading({
            title: '正在加载',
            success: res => {
              that.setData({
                selected3: "selected",
                coursedata: []
              })
              wx.setNavigationBarTitle({
                title: '收藏课程'
              })
              that.getcollect();
            }
          })

          break;
        }

    }
  },
  //获取正在学习课程
  getstudying() {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      success: res => {
        wx.request({
          url: that.data.feiyu + '/phone/center/personalCenter_learning?page=' + that.data.page,
          header: {
            "openId": wx.getStorageSync("openId"),
            "userId": wx.getStorageSync("userId"),
            "userInfoId": wx.getStorageSync("userInfoId"),
            "userName": wx.getStorageSync("userName")
          },
          method: "get",
          success: res => {
            if (res.data.code == 0) {
              var arr = res.data.courseList;
              var list = [];
              for (var i in arr) {
                this.setData({
                  collectcourse: {
                    courseId: arr[i].id,
                    coursePrice: arr[i].course_price,
                    courseImage: arr[i].course_image_address,
                    courseName: arr[i].course_name,
                    endTime: time.formatTimeTwo(arr[i].createTime / 1000, 'Y/M/D'),
                    student_count: arr[i].student_count,
                    level: arr[i].level
                  }
                });
                list.push(this.data.collectcourse);

              }
              this.setData({
                coursedata: this.data.coursedata.concat(list),
                selected: 1,
                total: res.data.TotalNumber
              })
              wx.hideLoading();

            } else {
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon: "none",
                duration: 2000
              })
            }
          }

        })
      }
    })

  },
  //获取已购课程
  getbought: function() {
    wx.request({
      url: this.data.feiyu + '/phone/course/buyedCourse',
      method: "get",
      header: {
        "openId": wx.getStorageSync("openId"),
        "userId": wx.getStorageSync("userId"),
        "userInfoId": wx.getStorageSync("userInfoId"),
        "userName": wx.getStorageSync("userName")
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.buyedCoursesList == null) {
            wx.showToast({
              title: '还未购买任何课程~~',
              icon: 'none',
              duration: 1000
            })
          } else {
            let arr = res.data.buyedCoursesList;
            for (let i = 0; i < arr.length; i++) {
              arr[i].endTime = time.formatTimeTwo(arr[i].endTime / 1000, 'Y/M/D');
            }
            this.setData({
              coursedata: this.data.coursedata.concat(arr),
              selected: 2
            })
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1000
          })
        }
        wx.hideLoading();
      }
    })
  },
  //获取收藏课程
  getcollect: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      success: res => {
        wx.request({
          url: that.data.feiyu + '/phone/center/personalCenter_collect_course?page=' + this.data.page,
          header: {
            "openId": wx.getStorageSync("openId"),
            "userId": wx.getStorageSync("userId"),
            "userInfoId": wx.getStorageSync("userInfoId"),
            "userName": wx.getStorageSync("userName")
          },
          method: "get",
          success: res => {
            if (res.data.code == 0) {
              var arr = res.data.courseList;
              var list = [];
              for (var i in arr) {
                this.setData({
                  collectcourse: {
                    courseId: arr[i].id,
                    coursePrice: arr[i].course_price,
                    courseImage: arr[i].course_image_address,
                    courseName: arr[i].course_name,
                    endTime: time.formatTimeTwo(arr[i].createTime / 1000, 'Y/M/D'),
                    student_count: arr[i].student_count,
                    level: arr[i].level
                  }
                });
                list.push(this.data.collectcourse);

              }
              this.setData({
                coursedata: this.data.coursedata.concat(list),
                selected: 3
              })
              wx.hideLoading();

            } else {
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon: "none",
                duration: 2000
              })
            }
          }

        })
      }
    })
  },
  //根据分类获取不同课程数据
  getlistdata: function(e) {
    this.setData({
      cla: parseInt(e.currentTarget.dataset.cla)
    })
    switch (this.data.cla) {
      case 1:
        this.setData({
          selected1: "selected",
          selected2: "",
          selected3: "",
          coursedata: []
        });
        this.getstudying();
        break;
      case 2:
        this.setData({
          selected1: "",
          selected2: "selected",
          selected3: "",
          coursedata: []
        });
        this.getbought();
        break;
      case 3:
        this.setData({
          selected1: "",
          selected2: "",
          selected3: "selected",
          coursedata: []
        });
        this.getcollect();
        break;

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname();
    this.setData({
      selected: parseInt(options.select)
    })
    this.getswitch(this.data.selected);
    this.myList = this.selectComponent('#myList');
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
    wx.stopPullDownRefresh();
    var that = this;
    wx.showLoading({
      title: '加载',
      success: res => {
        this.setData({
          page: 1
        })
        switch (this.data.selected) {
          case 1:
            this.setData({
              coursedata: []
            })
            this.getstudying();
            break;
          case 2:
            this.setData({
              coursedata: []
            })
            this.getbought();
            break;
          case 3:
            this.setData({
              coursedata: []
            })
            this.getcollect();
            break;
        }
        wx.hideLoading();

      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var num = parseInt(this.data.total / 10);
    if (this.data.total <= 10 || this.data.page >= num) {
      wx.showToast({
        title: '已加载全部',
        icon: 'success',
        duration: 1500
      })
    } else {
      this.setData({
        page: this.data.page + 1
      })
      // 根据请求类型，请求不同数据
      switch (this.data.selected) {
        case 1:
          this.getstudying();
          break;
        case 2:
          this.getbought();
          break;
        case 3:
          this.getcollect();
          break;
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})