// pages/my-card-list/my-card-list.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id:'',//店铺ID
    storeLogo:'',//店铺LOGO
    storeCardInfo:null,//
    myBespoke:false,//预约弹框是否显示 
    userName:'',//预约姓名
    userPhone: '',//预约电话
    errorInit: '',//错误提示
    isShowTip: false//是否显示办理会员卡提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      store_id:options.store_id
    });
    that.getStoreCardInfo();//执行请求我在该店铺的所有卡券信息
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
  //请求我在该店铺的所有卡券信息
  getStoreCardInfo:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getStoreCouAndMem',
      method: 'POST',
      data: Util.json2Form({
        openid: wx.getStorageSync('openid'),
        store_id: that.data.store_id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data;
          for(var i=0;i<data.coupon.length;i++){
            data.coupon[i].condition = parseInt(data.coupon[i].condition);
            data.coupon[i].money = parseInt(data.coupon[i].money);
          }
          for (var n = 0; n < data.membership.length;n++){
            data.membership[n].discount = data.membership[n].discount*10;
            data.membership[n].money = parseInt(data.membership[n].money);
          }
          that.setData({ 
            storeCardInfo: data,
            storeLogo: 'https://www.zsjyao.com/' + data.store.store_logo
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
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //获取姓名
  nameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  //获取电话
  phoneInput: function (e) { 
    this.setData({
      userPhone: e.detail.value
    })
  },
  //预约按钮
  myBespokeHandle:function(){
    var that = this;
    if (that.data.storeCardInfo.store_status==0){
      wx.showModal({
        title: '提示',
        content: '该店铺已关闭预约功能',
        showCancel: false,
        confirmText: '知道了'
      })
    }else{
      that.setData({
        myBespoke: true
      })
    }
      
  },
  //取消按钮
  popCancelHandle:function(){
    var that = this;
    that.setData({
      myBespoke: false
    })
  },
  //确定按钮
  popConfirmHandle:function(){
    var that = this;
    var userName = that.data.userName;
    var userPhone = that.data.userPhone;
    var phoneReg = /^1[34578]\d{9}$/;
    if(userPhone==''){
      that.setData({
        errorInit: '手机号不能为空！'
      })
    } else if (!(phoneReg.test(userPhone))){
      that.setData({
        errorInit: '您输入的手机号不正确！'
      })
    }else {
      that.setData({
        myBespoke: false
      })
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Customer/addUserOrder',
        method: 'POST',
        data: Util.json2Form({
          openid: wx.getStorageSync('openid'),
          store_id: that.data.store_id,
          name: userName,
          phone: userPhone
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: '预约成功',
              icon: 'success',
              duration: 2000
            })
            var s = that.data.storeCardInfo;
            s.user_order_number = res.data.user_order_number
            that.setData({ storeCardInfo:s})
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
  },
  toVipHandle:function(){
    wx.navigateTo({
      url: '../../pages/vip-handle/vip-handle'
    })
  },
  //没办理会员卡时操作的按钮
  nomyBespokeHandle:function(){
    if (this.data.storeCardInfo.store_status == 0){
      wx.showModal({
        title: '提示',
        content: "该店铺已关闭会员卡功能！",
        showCancel: false,
        confirmText: '知道了'
      })
    } else if (this.data.storeCardInfo.membership.length <= 0){
      wx.showModal({
        title: '提示',
        content: "您还没有办理该店铺会员卡！",
        showCancel: false,
        confirmText: '知道了'
      })
    }
    
  }
})