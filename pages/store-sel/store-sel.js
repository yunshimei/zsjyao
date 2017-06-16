// pages/store-sel/store-sel.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eat_number:0,//就餐人数
    store_id: 0,//店铺ID
    table_id: 0,//餐桌ID
    dishList: [],//提交订单后的订单列表数据
    totalNum: '',//已点页面点菜总数量
    totalPrice: '',//已点页面总价
    // isPayment: false,//是否付款
    isAll:false,//是否全上
    tm_id:'',
    tableNumList:null,//餐桌成员
    isShowMinusIcon:false,//是否显示减号
    addNumberIsShow: false,//添加人数弹框是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      store_id : options.store_id,
      table_id : options.table_id,
      eat_number: options.eat_number,
      tm_id:options.tm_id
    });
    
    that.storeGetTableNum();
    console.log(this.data.tm_id)
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
    this.storeSelHandle();
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
  //进入已点详情页面请求已点数据
  storeSelHandle: function () {
    var table_id = this.data.table_id;
    var store_id = this.data.store_id;
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/already_submit_menu',
      method: 'POST',
      data: Util.json2Form({
        tm_id: that.data.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        console.log(res);
        if (res.data.status == 1) {
          that.setdishListHandle(data);//执行处理提交的菜品列表数据函数
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
  //处理提交的菜品列表数据
  setdishListHandle: function (data) {
    var arr = [];
    var isAll=null;
    var singleAllDish=[]//单次提交的所有菜品
    for (var key in data) {
      if (typeof data[key] == 'object') {
        arr.unshift(data[key]);
      }
    }
    for (var i=0;i<arr.length;i++){
      singleAllDish = [];
      for (var n = 0; n < arr[i].already_menu.length;n++){
        if (arr[i].already_menu[n].is_serving==0){
          isAll=false
        }else{
          isAll = true
        }
        
        singleAllDish.push(arr[i].already_menu[n].id);
        
      }
      
      arr[i].isAll = isAll;
      arr[i].singleAllDish = singleAllDish.join(',');
    }
    this.setData({
      dishList: arr,
      totalNum: data.menu_num,
      totalPrice: data.menu_price,
      num_peo: data.num_peo
    })
    console.log(this.data.dishList)
  },
  //全上操作
  allChoseHandle:function(e){
    var that = this;
    var isAll = e.currentTarget.dataset.isall;
    var singleAllDish='';
    singleAllDish = e.currentTarget.dataset.singlealldish;
    console.log(isAll);
    if (!isAll){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateServing',
        method: 'POST',
        data: Util.json2Form({
          id: singleAllDish,
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 1) {
            that.storeSelHandle();
            // var arr = that.data.dishList;
            // var idArr = singleAllDish.split(",");
            // that.setData({ dtDataArr: arr });
            // for (var i = 0; i < arr.length;i++){
            //   for (var n = 0; n < arr[i].already_menu.length;n++){
            //     for(var m =0;m<idArr.length;m++){
            //       if (arr[i].already_menu[n].id==idArr[m]){
            //         arr[i].already_menu[n].is_serving=1
            //       }
            //     }
            //   }
            //   arr[i].isAll = true;
            //   break;
            // }
            // that.setData({ dishList: arr});
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
    }
  },
  //获取餐桌成员
  storeGetTableNum:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/userList',
      method: 'POST',
      data: Util.json2Form({
        tm_id: that.data.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          that.setData({
            tableNumList: data
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
        wx.hideLoading()
      }
    })
  },
  //删减按钮
  cutDishHandle:function(){
    this.setData({ isShowMinusIcon: !this.data.isShowMinusIcon})
    console.log(this.data.isShowMinusIcon)
  },
  minusHandle:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/delOrderMenu',
      method: 'POST',
      data: Util.json2Form({
        id: id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        console.log(res);
        if (res.data.status == 1) {
          var arr = that.data.dishList
          for(var i =0;i<arr.length;i++){
            for (var n = 0; n < arr[i].already_menu.length;n++){
              if (arr[i].already_menu[n].id == id){
                if (arr[i].already_menu[n].number>1){
                  console.log(arr[i].already_menu[n].number);
                  arr[i].already_menu[n].number = arr[i].already_menu[n].number-1;
                }else{
                  arr[i].already_menu.splice(n,1)
                }
              }
            }
          }
          that.setData({ dishList:arr});
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
  toClientMenu:function(e){
    wx.navigateTo({
      url: '/pages/client/client?'+'tm_id='+this.data.tm_id+'&status=0'+'&table_id='+this.data.table_id+'&severType=1'
    })
  },
  //大堂页面添加就餐人数-出现弹框
  addNumberHandle: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      addNumberIsShow: true,
    })
  },
  //输入就餐人数
  numberInput: function (e) {
    this.setData({
      eatNumber: e.detail.value
    })
  },
  //添加人数弹框确定
  popConfirmHandle: function () {
    var that = this;
    that.setData({
      addNumberIsShow: false,
    });
    wx.showLoading({
      title: '正在提交',
    })
    console.log(that.data.tm_id)
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/addTableNumber',
      method: 'POST',
      data: Util.json2Form({
        tm_id: that.data.tm_id,
        eat_number: that.data.eatNumber
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            eat_number: that.data.eatNumber
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
    });
  },
  //添加人数弹框取消
  popCancelHandle: function () {
    this.setData({
      addNumberIsShow: false,
    })
  },
  //加入黑名单
  addBlacklistHandle:function(e){
    var user_id = e.currentTarget.dataset.id;
    var user_name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '确认操作',
      content: '您确定把 ' +user_name+' 加入黑名单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})