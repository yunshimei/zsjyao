//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    }),
    wx.request({
      url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/region', //仅为示例，并非真实的接口地址
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },
  toAddDish:function(){
    wx.navigateTo({
      url: '/pages/add-dish/add-dish'
    })
  },
  toMOdifyDish:function(){
    wx.navigateTo({
      url: '/pages/modify-dish/modify-dish'
    })
  }
})
