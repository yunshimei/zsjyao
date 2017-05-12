//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  //点击商家入驻进入商家注册页面
  toRegister:function(){
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },
  //点击扫码点餐打开扫一扫界面
  scanOrder:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  }
})
