var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    tableCode:[],//餐桌二维码
    isShowPop:false,//是否显示添加二维码弹窗
    codeNum:1//用户输入的餐桌二给码数量
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.getTableCode();//执行获取餐桌二维码函数
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
  //获取餐桌二维码
  getTableCode:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Qrcode/tables_Qrcode',
      method: 'POST',
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id')
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          that.setData({
            tableCode:data
          })
          console.log(that.data.tableCode);
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
        wx.hideLoading()
      }
    })
  },
  //弹出添加餐桌二维码
  addCode:function(){
    var that = this;
    that.setData({
      isShowPop:true
    })
  },
  //取消添加餐桌二维码
  cancelPop:function(){
    var that = this;
    that.setData({
      isShowPop: false
    })
  },
  //获取用户输入的餐桌二维码数量
  codeNumInput: function (e) {
    this.setData({
      codeNum: e.detail.value
    })
  },
  //确认添加餐桌二维码
  confirmPop: function () {
    var that = this;
    var codeNum = that.data.codeNum;
    that.setData({
      isShowPop: false
    })
    console.log(codeNum);
    if(codeNum>0&&codeNum<=10){
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Qrcode/tables_qr_code',
        method: 'POST',
        data: Util.json2Form({
          store_id: wx.getStorageSync('store_id'),
          number: codeNum
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          var data = res.data.data;
          if (res.data.status == 1) {
            that.getTableCode();
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
    }else{
      that.setData({
        codeNum: 1
      })
      wx.showModal({
        title: '提示',
        content: '数量必须是1-10之间，请重新输入',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }
})