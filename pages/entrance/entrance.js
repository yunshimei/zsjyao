//index.js
//获取应用实例
var Util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    role:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserOpenId();//获取openId
    that.isauthorize();//执行是否同意授权
    
    that.judgeUserHandle();//调用判断用户角色函数
    
  },
  //是否同意授权
  isauthorize:function(){
    
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            complete() {
              console.log('123');
              app.getUserInfo(function (userInfo) {
                that.setData({
                  userInfo: userInfo
                });
                console.log('123');
                that.clientRegister();//执行普通用户注册
              });
            },
            fail(res){
              console.log(res);
            }
          })
        }
      }
    })
  },
  //普通用户注册
  clientRegister: function () {
    var that = this;
    var openid = app.globalData.userOpenId.openid;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/userRegister',
      method: 'POST',
      data: Util.json2Form({
        openid: openid,
        nickname: that.data.userInfo.nickName,
        head_pic: that.data.userInfo.avatarUrl,
        province: that.data.userInfo.province.toLowerCase()+'sheng',
        city: that.data.userInfo.city.toLowerCase()
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: res.errMsg,
          showCancel: false,
          confirmText: '知道了'
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //判断用户
  judgeUserHandle:function(){
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/userRole',
      method: 'POST',
      data: Util.json2Form({
        openid: openid,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1 || status == 2){
          wx.setStorageSync('store_id', res.data.store_id);
        }else if(status==0){
          //that.clientRegister();//执行普通用户注册
        }
        that.setData({
          role:status
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: res.errMsg,
          showCancel: false,
          confirmText: '知道了'
        })
      },
    })
  },
  //点击商家入驻进入商家注册页面
  toRegister:function(){
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },
  //点击进入店铺按钮跳转到大堂页面
  toStoreDt:function(){
    wx.navigateTo({
      url: "/pages/store/store?status=3",
    })
  },
  //点击我的跳转到我的页面
  toClientMy:function(){
    wx.navigateTo({
      url: "/pages/client/client?status=2",
    })
  },
  //点击扫码点餐打开扫一扫界面
  scanOrder:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res);
         wx.navigateTo({
          url: res.result
        })
      },
      // complete: (res) => {
      //   console.log(res.result);
        
      //   /**wx.showModal({
      //     title: '提示',
      //     content: res.path,
      //     showCancel: false,
      //     success: function (res) {
      //       if (res.confirm) {
      //         console.log('用户点击确定')
      //       } else if (res.cancel) {
      //         console.log('用户点击取消')
      //       }
      //     }
      //   })**/
        
      // }
    })
  }
})
