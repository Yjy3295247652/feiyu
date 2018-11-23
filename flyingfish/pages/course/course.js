// pages/course/course.js
var time = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:0,
    selected1:"",
    selected2: "",
    selected3: "",
    cla:0,
    coursedata:[],
    collectcourse:{
      courseId:0,
      coursePrice:0,
      courseImage:"",
      courseName:"",
      endTime:"",
      student_count:0,
      level:0
    },
  },
  // 获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  //获取不同分类效果
  getswitch:function(e){
    switch (e) {
      case 1: {
        var that = this;
        wx.showLoading({
          title: '正在加载',
          success:res=>{
            wx.setNavigationBarTitle({
              title: '正在学习'
            });
            that.setData({
              selected1: "selected"
            });
            this.getstudying();
          }
        })
        
        break;
      }
      case 2: {
        var that = this;
        wx.showLoading({
          title: '正在加载',
          success:res=>{
            that.setData({
              selected2: "selected"
            });
            wx.setNavigationBarTitle({
              title: '已购课程'
            });
            that.getbought();
          }
        })
        
        break;
      }
      case 3: {
        var that = this;
        wx.showLoading({
          title: '正在加载',
          success:res=>{
            that.setData({
              selected3: "selected"
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
  getstudying(){
    this.setData({
      coursedata: []
    });
    var that = this;
    wx.showLoading({
      title: '正在加载',
      success: res => {
        wx.request({
          url: that.data.feiyu + '/phone/center/personalCenter_learning?page=1',
          header: {
            "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
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
                coursedata: list,
                selected: 1
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
  getbought:function(){
    wx.request({
      url: this.data.feiyu + '/phone/course/buyedCourse',
      method: "get",
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.buyedCoursesList == null) {
            wx.showToast({
              title: '还未购买任何课程~~',
              icon: 'none',
              duration: 3000
            })
          }else{
            let arr = res.data.buyedCoursesList;
            for(let i = 0;i<arr.length;i++)
            {
              arr[i].endTime = time.formatTimeTwo(arr[i].endTime/1000, 'Y/M/D');
            }
            this.setData({
              coursedata: arr,
              selected:2
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    })
  },
  //获取收藏课程
  getcollect:function(){
    this.setData({
      coursedata:[]
    });
    var that = this;
    wx.showLoading({
      title: '正在加载',
      success:res=>{
        wx.request({
          url: that.data.feiyu + '/phone/center/personalCenter_collect_course',
          header: {
            "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
          },
          method: "get",
          success: res => {
            if(res.data.code == 0)
            {
              var arr = res.data.courseList;
              var list = [];
              for(var i in arr){
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
                coursedata:list,
                selected:3
              })
              wx.hideLoading();

            }else{
              wx.hideLoading();
              wx.showToast({
                title: '网络错误',
                icon:"none",
                duration:2000
              })
            }
          }

        })
      }
    })
  },
  //根据分类获取不同课程数据
  getlistdata:function(e){
    this.setData({
      cla:parseInt(e.currentTarget.dataset.cla)
    })
    switch(this.data.cla){
      case 1:
        this.setData({
          selected1: "selected",
          selected2:"",
          selected3: ""
        });
        this.getstudying();
        break;
      case 2:
        this.setData({
          selected1: "",
          selected2: "selected",
          selected3: ""
        });
        this.getbought();
        break;
      case 3:
        this.setData({
          selected1: "",
          selected2: "",
          selected3: "selected"
        });
        this.getcollect();
        break;

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getname();
    this.setData({
      selected:parseInt(options.select)
    })
    this.getswitch(this.data.selected);
    this.myList = this.selectComponent('#myList');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})