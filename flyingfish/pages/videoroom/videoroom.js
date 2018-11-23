function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
//创建节点选择器
var query = "";
// pages/videoroom/videoroom.js
Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    feiyu: '',
    chapterId: '',
    danmuList: [],
    chapter: null,
    commentAndReply: [],
    src: '',
    text:'',
    reply:{},
    replyFlag:false,
    flag:0,
    isCommen:false,
    commenText:"",
    scrollTop:0,
  },
  //获取域名
  getname() {
    var feiyu = getApp().globalData.host;
    this.setData({
      feiyu: feiyu
    })
  },
  // input失去焦点
  bindInputBlur: function(e) {
    this.setData({
      text: e.detail.value.trim()
    })
  },
  //发送按钮点击
  bindSendDanmu: function(e) {
    var that = this;
    if (that.data.text==""){
      return;
    }
    wx.request({
      url: that.data.feiyu + '/phone/course/course_chapter_comment',
      data: {
        content: that.data.text,
        chapterId: that.data.chapter.id
      },
      header: {
        "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
      },
      success: function(res) {
        if (res.data.code==0){
          that.getChapterCommentList();
          that.setData({
            text:""
          });
          wx.pageScrollTo({
            scrollTop:0,
            duration:0
          });
        }
      },
    })
  },
  //获取视频节信息、对应评论和回复
  getChapterCommentList() {
    var that = this;
    if (this.data.chapterId) {
      wx.request({
        url: this.data.feiyu + '/phone/course/chapterCommentList?chapterId=' + this.data.chapterId,
        header: {
          "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res) {
          res.data.commentAndReply.forEach(function(val,index){
            val.comment.isGood = false;
          });
          that.setData({
            chapter: res.data.chapter,
            commentAndReply: res.data.commentAndReply
          });
        }
      })
    } else {
      wx.showToast({
        title: '请重新选择视频',
        icon: 'none'
      })
    }
  },
  getReply(e){
    e.currentTarget.dataset.reply.index = e.currentTarget.dataset.index;
    this.setData({
      reply:e.currentTarget.dataset.reply,
      flag:1,
      scrollTop:0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getname()
    this.setData({
      chapterId: options.videoId
    })
    this.getChapterCommentList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
    query = wx.createSelectorQuery();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        src: that.data.chapter.video_address
      })
    }, 500)
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

  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          // console.log("左滑=====")
        } else {
          // console.log("右滑=====")
        }
      }
      if (absY > absX * 2 && tmY < 0) {
        // console.log("上滑动=====")
      }
      if (absY > absX * 2 && tmY > 0){
          if(this.data.flag == 1){
            this.setData({
              flag: 0
            });
          }         
      }else{
        this.setData({
          flag:2
        });
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  upper(){
    this.setData({
      flag:1
    });
  },
  like(e){
    let id = e.currentTarget.dataset.id;
    let that = this;
    let commentAndReply = that.data.commentAndReply;
    let url = "";
    if (e.currentTarget.dataset.isgood){
      url = that.data.feiyu + "/phone/course/comment_good_down"      
    }else{
     url =  that.data.feiyu + "/phone/course/comment_good"
    }
    wx.request({
      url: url,
      data:{
        commentId:id
      },
      success(res){
        if (res.data.msg == "点赞成功"){
          commentAndReply[e.currentTarget.dataset.index].comment.isGood = true;
          commentAndReply[e.currentTarget.dataset.index].comment.good = res.data.good;
          that.setData({
            commentAndReply: commentAndReply
          });
          let reply = commentAndReply[e.currentTarget.dataset.index];
          reply.index = e.currentTarget.dataset.index;
          if(that.data.flag !=0){
            that.setData({
              reply: reply
            })
          }
        } else if (res.data.message == "点灭成功"){
          commentAndReply[e.currentTarget.dataset.index].comment.isGood = false;
          commentAndReply[e.currentTarget.dataset.index].comment.good = res.data.good;
          that.setData({
            commentAndReply: commentAndReply
          });
          let reply = commentAndReply[e.currentTarget.dataset.index];
          reply.index = e.currentTarget.dataset.index;
          if (that.data.flag != 0) {
            that.setData({
              reply: reply
            })
          }
        }
      }
    })
  },
  comment(){
    let that = this;
    that.setData({
      isCommen:true
    });
  },
  comment1(e){
    let that = this;
    that.setData({
      isCommen: false,
      commenText: e.detail.value.trim()
    });
  },
  send(){
    if(this.data.commenText!=""){
      let that = this;
      wx.request({
        url: that.data.feiyu +"//phone/course/chapter_comment_reply",
        data:{
          commentId: that.data.reply.comment.id,
          replyUserId: that.data.reply.comment.userId,
          reply: that.data.commenText
        },
        header:{
          Cookie: "JSESSIONID=" + wx.getStorageSync("sessionId")
        },
        success(res){
          if(res.data.code == 0){
            let commentAndReply = that.data.commentAndReply;
            commentAndReply[that.data.reply.index].reply.push(res.data.reply);
            let reply = that.data.reply;
            reply.reply.push(res.data.reply);
            that.setData({
              commenText:"",
              commentAndReply: commentAndReply,
              reply: reply
            });
            query.select('#all-reply-main').boundingClientRect();
            query.exec(function (res) {
              console.log(res[0].height);              
              that.setData({
                scrollTop: res[0].height
              });
            })
          }
        }
      })
    }
  }
})