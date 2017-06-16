var Util = require('../../utils/util.js');
var app = getApp();
Page({
   data:{
     selList:[],
     imgUrls: [
      '/images/banner-1.jpg',
      '/images/banner-2.jpg',
      '/images/banner-3.jpg'
    ],
    indicatorDots: true,
    indicatorColor:"#f8f8f8",
    indicatorActiveColor:"#f2582a",
    autoplay: true,
    circular:true,
    interval: 5000,
    duration: 1000
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({ store_id: options.store_id, table_id: options.table_id, role: options.role,tm_id:options.tm_id});
    if(this.data.role==3){
      this.getClientSelData();
    }
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
  //进入客户已点详情页面获取数据
  getClientSelData:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/already_submit_menu',
      method: 'POST',
      data: Util.json2Form({
        tm_id:that.data.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          that.setClientSelData(data);//执行处理客户已点列表数据
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '知道了'
          })
        }
      },
      fail: function () {
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
  //处理客户已点菜单数据
  setClientSelData:function(data){
    var arr = [];
    for(var key in data){
      if( typeof data[key]=='object'){
        for (var i = 0; i < data[key].already_menu.length;i++){
          arr.unshift(data[key].already_menu[i]);
        }
      }
    }
    this.setData({
      selList:arr,
      menu_num: data.menu_num,
      menu_price: data.menu_price,
      num_peo: data.num_peo
    })
  }
})