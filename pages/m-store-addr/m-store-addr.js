var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    provinces: [],//所有省份
    province: '',//当前选择的省
    citys: [],//当前省下的所有市
    city: '',//当前选择的市
    countys: [],//当前市下的所有区
    county: '',//当前选择的区
    value: [0, 0, 0],//选择的省市区的数组
    condition: false,//判断省市区窗口是否显示
    storeAddr:'',
    errorInit:''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    app.getUserOpenId();//调用获取useropenid的函数
    Util.getArea(this);//调用获取省市区的函数
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
    console.log(options);
 
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
  //显示或隐藏省市区的选择界面
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  //在省市区的选择界面点击确定
  confirmHandle: function () {
    var value = this.data.value;
    var provinces = this.data.provinces;
    var citys = this.data.citys;
    var countys = this.data.countys;
    this.setData({
      condition: false,
      province: provinces[value[0]].name,
      city: citys[value[1]].name,
      county: countys[value[2]].name
    })
    //var areaInput = document.getElementById("areaInput");
    //areaInput.setAttribute("value", "{{province}}{{city}}{{county}}");
  },
  //在省市区的选择界面点击取消
  cancelHandle: function () {
    this.setData({
      condition: false,
      value: [0, 0, 0]
    })
  },
  //省市区的选择界面选择值时
  bindChange: function (e) {
    var value = e.detail.value;
    var oldVal = this.data.value;
    if (value[0] != oldVal[0]) {
      value = [value[0], 0, 0];
      value[1] = 0;
      value[2] = 0;
    } else if (value[1] != oldVal[1]) {
      value[2] = 0;
    }
    var citys = this.data.provinces[value[0]].city;
    this.setData({
      value: value,
      citys: citys,
      countys: citys[value[1]].area,
      value: value
    });
  },
  addrInput:function(e){
    this.setData({
      storeAddr: e.detail.value
    })
  },
  //点击提交按钮
  submitHandle:function(){
    var value = this.data.value;
    var addr = this.data.storeAddr;
    var province = this.data.province;
    var city = this.data.city;
    var county = this.data.county;

    if(addr==""){
      this.setData({
        errorInit:'地址不能为空！'
      })
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateStoreInfo',
        method: 'POST',
        data: Util.json2Form({
          openid: app.globalData.userOpenId.openid,
          store_id: this.data.storeId,
          province_id: this.data.provinces[value[0]].id,
          city_id: this.data.citys[value[1]].id,
          district: this.data.countys[value[2]].id,
          store_address: this.data.storeAddr
        }),
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功',
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