// components/list/list.js
var time = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titlename: Array,
    listdata: Array,
    flag: Boolean,
    flags: Boolean,
    directionId: String,
    feiyu: String,
    activeid: String,
    bottomShow: Boolean,
    hasright:Boolean,
    selected:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeid: 0,
    code: 53,
    num: 0,
    hasList: true,
    feiyu:"https://v.uekedu.com:8089"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getcollect: function () {
      this.setData({
        coursedata: []
      });
      var that = this;
      wx.showLoading({
        title: '正在加载',
        success: res => {
          wx.request({
            url: that.data.feiyu + '/phone/center/personalCenter_collect_course',
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
    deleteList(e) {
      console.log(e);
      const courseId = e.currentTarget.dataset.index;
      console.log(courseId);
      wx.request({
        url: this.data.feiyu+'/phone/course/course_collect?courseId='+courseId,
        method:"get",
        header:{
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success:res=>{
          if(res.data.code == 0){
            this.setData({
              coursedata:[]
            })
            this.getcollect();
          }
        }
      })
    },
  }
})