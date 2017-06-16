var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    packageArr:[],//获取到的套餐数组
    p_id:''//用户选择的套餐ID
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.getRechargeInfo();
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
  //获取套餐
  getRechargeInfo:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/package',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if(res.data.status==1){
          that.setData({packageArr:data})
        }
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
  //选择某个套餐充值
  rechargeHandle:function(e){
    var p_id = e.currentTarget.dataset.p_id
    this.setData({p_id:p_id});
  },
  //充值按钮
  rechargeBtn:function(){
    var that = this;
    var p_id = that.data.p_id;
    var store_id = wx.getStorageSync('store_id');
    var openid='';
    if (wx.getStorageSync('openid')){
      openid = wx.getStorageSync('openid');
    }else{
      openid = app.globalData.userOpenId.openid;
    }
    if (p_id==''){
      wx.showModal({
        title: '提示',
        content: '请选择套餐',
        showCancel: false,
        confirmText: '知道了'
      })
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/rechargePackage',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: Util.json2Form({
          openid: openid,
          p_id: p_id,
          store_id: store_id
        }),
        success: function (res) {
          var data = res.data.data;
          if (res.data.status == 1) {
            wx.requestPayment({
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  });
                }
              },
              'fail': function (res) {
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                    image: '/images/tip-icon.png',
                    duration: 2000
                  })
                }
              }
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
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    }
    
  }
})