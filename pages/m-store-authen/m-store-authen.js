var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    errorInit: '',
    uName: '',
    uIdCard: '',
    isAuthen:'未认证'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
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
  //获取用户输入的姓名
  nameInput: function (e) {
    this.setData({
      uName: e.detail.value
    })
  },
  //获取用户输入的身份证
  idCardInput: function (e) {
    this.setData({
      uIdCard: e.detail.value
    })
  },
  //点击提交操作
  submitHandle:function(){
    var that = this;
    var name = that.data.uName;
    var idCard = that.data.uIdCard;
    var idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; 
    console.log(name);
    if(name==''){
      this.setData({
        errorInit: '姓名不能为空！'
      })
    }else if(idCard==""){
      this.setData({
        errorInit: '身份证不能为空！'
      })
    } else if (!(idCardReg.test(idCard))){
      this.setData({
        errorInit: '您输入的身份号码不正确！'
      })
    }else{
      this.setData({errorInit: ' '});
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateStoreInfo',
        method: 'POST',
        data: Util.json2Form({
          store_id: this.data.storeId,
          openid: app.globalData.userOpenId.openid,
          real_name: this.data.uName,
          card_id: this.data.uIdCard
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: '验证成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
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
  }
})