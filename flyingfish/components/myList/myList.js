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
    bottomShow: Boolean,
    hasright:Boolean
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