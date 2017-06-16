// pages/today-bespoke/today-bespoke.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores_id: '',//店铺ID
    todayBespokeList:[],//今日预约列表 
    // cardTeams:[{"id":"aaaaa", "right":0, "startRight":0},{"id":"bbbb",  "right":0, "startRight":0}]  
    startX:null,
    idArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ store_id: wx.getStorageSync('store_id')});
    this.getTodayBespokeList();
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
  //获取今日预约列表
  getTodayBespokeList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getUserOrderList',
      method: 'POST',
      data: Util.json2Form({
        store_id: that.data.store_id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          var data = res.data.data;
          var idArr=[];
          for(var i=0;i<data.length;i++){
            idArr.push({
              id:data[i].id,
              status:false
            })
          }
          that.setData({ 
            todayBespokeList:res.data.data,
            idArr: idArr
          });
          console.log(that.data.todayBespokeList)
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
  drawStart:function(e){
    console.log(e)
    this.setData({
      startX: e.changedTouches[0].clientX
    })
    // var touch = e.touches[0];
    // startX = touch.clientX;
    // startY = touch.clientY;
  },
  drawEnd:function(e){
    var endX = e.changedTouches[0].clientX;
    var startX = this.data.startX;
    var dValue = endX-startX;
    var id = e.currentTarget.dataset.id;
    var idArr = this.data.idArr;
    if (dValue<-10){
      for(var i = 0 ; i < idArr.length ; i++) {
        if(idArr[i].id == id) {
          idArr[i].status = true;
        }else{
          idArr[i].status = false;
        }
      }
    }else if(dValue>10){
      for (var i = 0; i < idArr.length; i++) {
        if(idArr[i].id == id && idArr[i].status) {
          idArr[i].status = false;
        }
      }
    }
    this.setData({idArr: idArr});
  },
  drawMove:function(e){
    
  },
  delItem: function (e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/delUserOrder',
      method: 'POST',
      data: Util.json2Form({
        id: id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          var arr = that.data.todayBespokeList;
          for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
              arr.splice(i,1);
              break;
            }
          }
          that.setData({ todayBespokeList:arr})
          wx.showToast({
            title: '删除成功',
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
})