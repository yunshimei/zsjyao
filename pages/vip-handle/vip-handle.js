// pages/vip-handle/vip-handle.js
var Util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id:'',//店铺ID
    storeVipCardData:null,//店铺的所有会员卡数据
    storeLogo:''//店铺头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.store_id){
      this.setData({ store_id: options.store_id });
    }else{
      this.setData({ store_id: wx.getStorageSync('store_id') });
    }
    
    this.getStroeVipInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取该店铺的会员卡信息
  getStroeVipInfo:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getStoreMembership',
      method: 'POST',
      data: Util.json2Form({
        store_id: that.data.store_id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var arr = res.data.data.list;
          for(var i =0;i<arr.length;i++){
            arr[i].discount = arr[i].discount*10;
            arr[i].money = parseInt(arr[i].money);
          }
          that.setData({ 
            storeVipCardData: res.data.data,
          })
          if (res.data.data.store.store_logo){
            that.setData({
              storeLogo: 'https://www.zsjyao.com/' + res.data.data.store.store_logo
            })
          }
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
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  //点击充值会员卡
  rechargeVipCard:function(e){
    var that = this;
    var ms_id = e.currentTarget.dataset.ms_id;
    var openid = null;
    if (wx.getStorageSync('openid')){
      openid = wx.getStorageSync('openid');
    }else{
      openid = app.globalData.userOpenId.openid
    }
    var store_id = that.data.store_id;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/payMembership',
      method: 'POST',
      data: Util.json2Form({
        openid: openid,
        ms_id: ms_id,
        store_id: store_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
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
                that.setData({
                  isPayment: true
                })
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