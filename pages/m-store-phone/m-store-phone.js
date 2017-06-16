var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    userPhone:'',
    errorInit: ''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
    app.getUserOpenId();
    this.setData({
      store_phone: options.store_phone
    })
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
   
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  phoneInput:function(e){
    this.setData({
      userPhone: e.detail.value
    })
  },
  submitHandle:function(){
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateStoreInfo',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.storeId,
        openid: app.globalData.userOpenId.openid,
        store_phone: this.data.userPhone
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
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
})