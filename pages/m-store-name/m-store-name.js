var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    storeData:null,
    storeName:'',
    errorInit:''
  },
  onLoad:function(options){
    console.log(app.globalData);
    this.setData({
      storeId: wx.getStorageSync('store_id'),
      storeName:app.globalData.store_name
    });
    app.getUserOpenId();
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
  storeNameInput: function (e) {
    this.setData({
      storeName: e.detail.value
    })
  },
  submitHandle:function(){
    var storeName = this.data.storeName;
    if (storeName==''){
      this.setData({
        errorInit:"店铺名称不能为空！"
      })
    } else if (storeName.length>15){
      this.setData({
        errorInit: "店铺名称不能超过15个字符！"
      })
    }else{
      this.setData({ errorInit: ' ' });
      // var data = {
      //     store_id: this.data.storeId,
      //     openid: app.globalData.userOpenId.openid,
      //     store_name: this.data.storeName
      //   }
      // req('https://www.zsjyao.com/index.php/Api/Weixin/updateStoreInfo',
      // data,function(res){
      //   console.log(res);
      // })
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateStoreInfo',
        method: 'POST',
        data: Util.json2Form({
          store_id: this.data.storeId,
          openid: app.globalData.userOpenId.openid,
          store_name: this.data.storeName
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 1){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
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