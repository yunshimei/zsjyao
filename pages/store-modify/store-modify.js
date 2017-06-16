var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    storeId:'',
    //storeName:''
    storeCenterData:null,
    storeLogo:'',//店铺LOGO
    isOpenBespoke:''//是否开启预约
  },
  onShow:function(options){
    // 生命周期函数--监听页面加载
    var that = this;
    app.getUserOpenId();
    this.setData({
      sellerName: wx.getStorageSync('seller_name'),
      storeId: wx.getStorageSync('store_id')
      });
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getStoreInfo',
      method: 'POST',
      data: Util.json2Form({ 
        store_id: this.data.storeId,
        seller_name: this.data.sellerName,
        openid: app.globalData.userOpenId.openid
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          var isOpenBespoke=null;
          data.is_order == 1 ? isOpenBespoke = true : isOpenBespoke=false;
          that.setData({
            storeCenterData: data,
            isOpenBespoke: isOpenBespoke
          });
        }
      }
    })
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
   
  },
  onLoad:function(option){
    // 生命周期函数--监听页面显示
    this.setData({ storeLogo: option.logoImage})
    
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
  //修改店铺logo
  changeLogoHandle:function(){
    var that = this;
    console.log(that.data.storeId);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: "https://www.zsjyao.com/index.php/Api/Weixin/uploadStoreLogo", // 你的接口地址
          filePath: tempFilePaths[0],
          name: "image",
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            console.log(res);
            var data = JSON.parse(res.data);
            if (data.status == 1) {
              console.log(222);
              wx.request({
                url: 'https://www.zsjyao.com/index.php/Api/Weixin/addStoreLogo',
                method: 'POST',
                data: Util.json2Form({
                  store_id: that.data.storeId,
                  logo: data.url
                }),
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res);
                  if(res.data.status==1){
                    that.setData({
                      storeLogo: 'https://www.zsjyao.com/' + data.url,
                      imageUrl: data.url
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
            } else {
              that.setData({
                errorInit: '图片太大'
              })
            }

          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示错误',
              content: res.errMsg,
              showCancel: false,
              confirmText: '知道了'
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showModal({
          title: '提示错误',
          content: res.errMsg,
          showCancel: false,
          confirmText: '知道了'
        })
      }
    })
  },
  //从修改店铺信息页面跳转到店名
  modiName: function(){
      wx.navigateTo({
      url: '../../pages/m-store-name/m-store-name'
    })
  },
  //从修改店铺信息页面跳转到地址
  modiAddr: function(){
      wx.navigateTo({
        url: '../../pages/m-store-addr/m-store-addr'
    })
  },
  //从修改店铺信息页面跳转到账号
  modiNum: function () {
    wx.navigateTo({
      url: '../../pages/m-store-num/m-store-num?seller_name=' + this.data.storeCenterData.seller_name+'&card_id=' + this.data.storeCenterData.card_id
    })
  },
  //从修改店铺信息页面跳转到店铺电话
  modiPhone: function(){
      wx.navigateTo({
        url: '../../pages/m-store-phone/m-store-phone?store_phone=' + this.data.storeCenterData.store_phone
    })
  },
  //从修改店铺信息页面跳转到实名认证
  modiAuthen: function(){
      wx.navigateTo({
      url: '../../pages/m-store-authen/m-store-authen'
    })
  },
  //从修改店铺信息页面跳转到发布优惠券
  modiCoupon: function(){
      wx.navigateTo({
      url: '../../pages/m-store-coupon/m-store-coupon'
    })
  },
  //从修改店铺信息页面跳转到提现
  modiCash: function(){
      wx.navigateTo({
      url: '../../pages/m-store-cash/m-store-cash'
    })
  },
  //从修改店铺信息页面跳转到黑名单
  modiBlacklist:function(){
      wx.navigateTo({
      url: '../../pages/m-store-blacklist/m-store-blacklist'
    })
  },
  
   //从修改店铺信息页面跳转到设置会员卡
  toSetCard:function(){
    wx.navigateTo({
      url: '../../pages/setCard/setCard'
    })
  },
  //获取是否开启的值
  switch1Change:function(e){
    console.log(e.detail.value)
    this.setData({ isOpenBespoke: e.detail.value})
  },
  //开始预约功能操作
  openBespokeHandle:function(){
    var that = this;
    var is_order=null;
    if (that.data.isOpenBespoke){
      is_order=1;
    }else{
      is_order = 0;
    }
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/openIsOrder',
      method: 'POST',
      data: Util.json2Form({
        is_order: is_order,
        store_id: that.data.storeId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          that.setData({ isOpenBespoke: that.data.isOpenBespoke})
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
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