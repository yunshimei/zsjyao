// pages/pay-bill/pay-bill.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id:'',
    openid:'',
    tm_id:'',
    store_name:'',
    payInfo:null,//进入页面获取到的付款页面数据
    choseId:'',//选择的会员卡或优惠券ID
    order_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      store_id: options.store_id,
      openid: wx.getStorageSync('openid'),
      tm_id:options.tm_id,
      store_name: options.store_name,
      order_id: options.order_id
    })
    this.getPayInfo();
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
  //获取付款页面信息
  getPayInfo:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getUserCouponAndMembership',
      method: 'POST',
      data: Util.json2Form({
        openid: that.data.openid,
        order_id: that.data.order_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
         var data = res.data.data;
         var choseId='';
         for (var i = 0; i < data.coupon.length; i++) {
           data.coupon[i].condition = parseInt(data.coupon[i].condition);
           data.coupon[i].money = parseInt(data.coupon[i].money)
         }
         for (var n = 0; n < data.membership.length; n++) {
           data.membership[n].discount = data.membership[n].discount * 10;
           data.membership[n].money = parseInt(data.membership[n].money)
         }
         if (data.coupon.length>0){
           choseId=data.coupon[0].id;
         }else if(data.coupon.length>0){
           choseId = data.membership.id;
         }else{
           choseId='';
         }
         that.setData({ 
           payInfo: data ,
           choseId: choseId
         });
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
  choseHandle:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.choseid;
    console.log(id);
    this.setData({choseId:id})
  }
})