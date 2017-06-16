//app.js
var Util = require('utils/util.js');
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    that.getUserOpenId();
    // wx.connectSocket({
    //   url: 'wss://www.zsjyao.com/sockets',
    //   header: {
    //     'content-type': 'text/html'
    //   },
    //   method: "GET",
    //   success:function(){
    //     console.log(111);
    //   }
    // });
    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    // })
  },
  onShow:function(){
    
    // wx.connectSocket({
    //   url: 'wss://www.zsjyao.com/sockets',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET"
    // })
    //console.log('show');
  },
  onHide:function(){
    //console.log('hide');
    // wx.onSocketOpen(function () {
    //   wx.closeSocket()
    // })
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 已关闭！')
    // })
    wx.onSocketOpen(function () {
      console.log('WebSocket连接已打开！')
      wx.closeSocket()
    })
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getUserOpenId:function(cb){
    var that = this;
    wx.login({
      success: function(res){
        // success
        var appid = 'wx93ad3b4ea4232d0a';
        var secret = 'cb80922f8bdb4f39d1930961c72e9be5';
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+res.code+'&grant_type=authorization_code';
        wx.request({
          url: url,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {  
            'content-type': 'application/json'  
          },
          success: function(res){
            that.globalData.userOpenId = res.data;
            wx.setStorageSync('openid', res.data.openid)
            cb&&cb(res.data.openid);
          },
          fail: function(res) {
          }
        })
      },
      fail: function(res) {
        // fail
      }
    })
  },
  jumpRedirectTo:function(url){
    wx.redirectTo({
      url: url
    })
  },
  globalData:{
    userInfo:null,
    userOpenId:null,
    appid:'wx93ad3b4ea4232d0a',
    secret:'32f8aff84229d5aa0c65d9bb3e4b9a3d'
  }
})