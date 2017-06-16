var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id:null,//店铺ID
    myVipList:[]//我的会员卡列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that =this;
    that.setData({
      store_id: options.store_id
    })
    that.getVipList();
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
  /**
   * 请求会员卡列表
   */
  getVipList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getStoreCouOrMem',
      method: 'POST',
      data: Util.json2Form({
        openid: wx.getStorageSync('openid'),
        sign: 1
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          var arr = res.data.data.membership;
          for (var i = 0; i < arr.length;i++){
            arr[i].discount = arr[i].discount*10;
            arr[i].money = parseInt(arr[i].money);
          }
          that.setData({ myVipList:arr})
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
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //跳转到该店铺的会员卡和优惠券列表页面
  toStoreCardInfo: function (e) {
    var store_id = e.currentTarget.dataset.store_id;
    wx.navigateTo({
      url: '/pages/my-card-list/my-card-list?store_id=' + store_id
    })
  }
})