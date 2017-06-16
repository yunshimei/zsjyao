var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    status:0,//切换状态
    useStrarData: '开始时间',//使用开始时间
    useEndData: '结束时间',//使用结束时间
    currentData:'',//当前日期
    money: '',//消费金额
    num: '',//送券张数
    worth: '',//单券价值
    errorInit: '',
    couponList:[],//优惠券列表
    swithIsOpen:null,//控制swith开关
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.getCurrentData();
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
  //获取当前日期
  getCurrentData:function(){
    var myDate = new Date(); 
    var currentYear = myDate.getFullYear();
    var currentMouth = myDate.getMonth()+1;
    var currentDay = myDate.getDate();
    if (currentMouth<10){
      currentMouth = '0' + currentMouth
    }
    var currentData = currentYear + '-' + currentMouth + '-' + currentDay
    this.setData({ currentData: currentData});
  },
  // 使用开始时间选择
  binduseStrarData: function (e) {
    this.setData({
      useStrarData: e.detail.value
    })
  },
  // 使用结束时间选择
  binduseEndData: function (e) {
    this.setData({
      useEndData: e.detail.value
    })
  },
  //用户输入的消费金额
  moneyInput:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  //用户输入的送券张数
  numberInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  //用户输入的单券价值
  worthInput: function (e) {
    this.setData({
      worth: e.detail.value
    })
  },
  //切换栏操作
  navHandle:function(e){
    var status = e.currentTarget.dataset.status;
    if(status==0){
      this.setData({ status: 0 });
    }else{
      this.setData({ status: 1 });
      this.getSendCoupon();
    }
    
  },
  //点击发布按钮
  couponBtnHandle:function(){
    var that = this;
    var couponData= {};
    couponData.useStrarData = that.data.useStrarData;
    couponData.useEndData = that.data.useEndData;
    couponData.money = that.data.money;
    couponData.num = that.data.num;
    couponData.worth = that.data.worth;
    couponData.store_id = wx.getStorageSync('store_id');
    console.log(couponData);
    if (!couponData.money){
      that.setData({ errorInit:'请输入消费金额！'})
    } else if (!couponData.num){
      that.setData({ errorInit: '请输入送券张数！' })
    } else if (couponData.num > 100 || couponData.num<1) {
      that.setData({ errorInit: '送券张数为1-100之间！' })
    }else if (!couponData.worth) {
      that.setData({ errorInit: '请输入单券价值！' })
    } else if (couponData.useStrarData == '开始时间') {
      that.setData({ errorInit: '请选择使用开始时间！' })
    } else if (couponData.useEndData == '结束时间') {
      that.setData({ errorInit: '请选择使用结束时间！' })
    }else{
      that.setData({ errorInit: '' });
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/addCoupon',
        method: 'POST',
        data: Util.json2Form({
          store_id: couponData.store_id,
          condition: couponData.money,
          money: couponData.worth,
          createnum: couponData.num,
          use_start_time: couponData.useStrarData,
          use_end_time: couponData.useEndData
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              money:'',
              num:'',
              worth:'',
              grantStrarData:'开始时间',
              grantEndData: '结束时间',
              useStrarData: '开始时间',
              useEndData: '结束时间',
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
  },
  //swith操作
  switch1Change:function(e){
    this.setData({ swithIsOpen: e.detail.value});
  },
  //显示隐藏操作
  showHideHandle:function(e){
    var that = this;
    var IsOpen = that.data.swithIsOpen;
    var is_open = null;
    if (IsOpen){
      is_open = 1;
    }else{
      is_open = 0;
    }
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/isOpen',
      method: 'POST',
      data: Util.json2Form({
        id: e.currentTarget.dataset.id,
        is_open: is_open
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
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
  },
  //获取已发布的优惠券
  getSendCoupon:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getCouponList',
      method: 'POST',
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id')
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          for(var i =0;i<res.data.data.length;i++){
            res.data.data[i].condition = parseInt(res.data.data[i].condition);
            res.data.data[i].money = parseInt(res.data.data[i].money);
          }
          that.setData({
            couponList:res.data.data
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
      complete:function(){
        wx.hideLoading();
      }
    })
  }
})