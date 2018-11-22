// components/list/list.js
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
    bottomShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeid: 0,
    code: 53,
    num: 0,
    hasList: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getid: function (e) {
      // console.log(e)
      // console.log(this.directionId)
      this.setData({
        activeid: e.target.dataset.id,
        num: e.target.offsetLeft - 86
      })
      var that = this;
      var val = e.target.dataset.classifylist == undefined ? that.data.codes : e.target.dataset.classifylist; //通过这个传递数据
      var ClassifyListId = {
        val: val,
      } // detail对象，提供给事件监听函数
      this.triggerEvent('a', ClassifyListId) //a自定义名称事件，父组件中使用
    },
    deleteList(e) {
      const index = e.currentTarget.dataset.index;
      let carts = this.data.carts;
      carts.splice(index, 1);
      this.setData({
        carts: carts
      });
      if (!carts.length) {
        this.setData({
          hasList: false
        });
      } else {

      }
    },
  }
})