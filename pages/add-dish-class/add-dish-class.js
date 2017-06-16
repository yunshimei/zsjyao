var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    dishClass: '',
    errorInit: ''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  dishClassInput: function (e) {
    this.setData({
      dishClass: e.detail.value
    })
  },
  submitHandle:function(){
    var dishClass = this.data.dishClass;
    if(dishClass=""){
      errorInit: '菜品类别不能为空！'
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/addStoreType',
        method: 'POST',
        data: Util.json2Form({
          st_name: this.data.dishClass,
          store_id: this.data.storeId
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.data;
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            });
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '知道了'
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            showCancel: false,
            confirmText: '知道了'
          })
        }
      })
    }
  }
})