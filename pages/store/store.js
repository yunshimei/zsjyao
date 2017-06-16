// pages/store/store.js
var Util = require('../../utils/util.js');
//var socket = require('../../utils/socket.js');
var app = getApp();
Page({
  data:{
    status:3,
    dataDt:{},
    dataMenu:{},
    dataCenter:{},
    st_id:'',
    storeId:'',//店铺ID
    table_id:'',//餐桌ID
    noData: false,
    noDishData: true, 
    isHide:false,
    addNumberIsShow:false,//添加人数弹框是否显示
    eatNumber:'',//就餐人数
    store_name:'',//店铺名字
    dtDataArr:[],//大堂餐桌菜品数据
    dtDataisShow:false,//大堂菜单数据是否显示 
    logoImage: '/images/no-store-head.png',//店铺LOGO 
    bascPri: 0,//基本餐位费
    isSetBacePri:false,//是否显示设置基本餐位费弹框
    bacePriInput:null//用户输入的基本餐位费
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    app.getUserOpenId(this.isauthorize);//获取用户openid后判断角色
    var that = this;
    this.getStoreId(/*options.store_id*/"3");//执行获取storeId
    this.setData({status: options.status,
      //storeId: options.store_id//从地址携带参数获取店铺ID
    });
    if (that.data.status==5){
      this.stoteCenterData();//执行获取店铺中心数据函数
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    //app.getUserOpenId(this.stoteCenterData);//获取用户openid后
    this.storeMenuData();//执行铺菜单并且请求数据函数
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 页面下拉刷新
  // onPullDownRefresh: function () {
  //   this.getDtData();//执行大堂页面请求数据
  //   wx.stopPullDownRefresh()
  // },
  
  //是否同意授权
  isauthorize: function () {
    var that = this;
    wx.showLoading({ title: '加载中', });
    wx.getSetting({
      success(res) {
        if (!res['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            complete() {
              console.log('123');
              app.getUserInfo(function (userInfo) {
                that.setData({
                  userInfo: userInfo
                });
                that.clientRegister();//执行普通用户注册
              });
            }
          })
        } else {
          that.isStaffHandle();
        }
      }
    })
  },
  //普通用户注册
  clientRegister: function () {
    var that = this;
    var openid = app.globalData.userOpenId.openid;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/userRegister',
      method: 'POST',
      data: Util.json2Form({
        openid: openid,
        nickname: that.data.userInfo.nickName,
        head_pic: that.data.userInfo.avatarUrl,
        province: that.data.userInfo.province.toLowerCase() + 'sheng',
        city: that.data.userInfo.city.toLowerCase()
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          that.isStaffHandle();
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
      // complete: function () {
      //   wx.hideLoading()
      // }
    })
  },
  // 页面切换 
  navHandle: function (e) {
    var that =this;
    var status = e.target.dataset.status
    this.setData({
      status: status
    })
    if (status == 3) {
    } else if (status == 4) {
      that.storeMenuData();
    } else if (status == 5) {
      this.stoteCenterData();//执行获取店铺中心数据函数
    }
  },
  // 获取店铺id
  getStoreId: function (store_id){
    if (store_id){
      this.setData({ storeId: store_id});
    }else{
      this.setData({ storeId: wx.getStorageSync('store_id')});//从缓存获取店铺id
    }
  },
  //判断角色,如果不是加入成为员工
  isStaffHandle: function (){
    var that = this;
    var openid = '';
    if (wx.getStorageSync('openid')){
      openid = wx.getStorageSync('openid');
    }else{
      openid = app.globalData.userOpenId.openid;
    }
    var roleStatus = wx.getStorageSync('roleStatus');
    if (roleStatus){
      if (roleStatus == 1) {
        that.getDtData();
      } else if (roleStatus == 2) {
        taht.getDtData();
      } else if (roleStatus == 3) {
        wx.showModal({
          title: '提示',
          content: '确定加入店铺：' + that.data.store_name,
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: 'https://www.zsjyao.com/index.php/Api/Weixin/addWaiter',
                method: 'POST',
                data: Util.json2Form({
                  openid: openid,
                  store_id: that.data.storeId,
                }),
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.status == 1) {
                    that.setData({ dtDataisShow: true });
                    wx.showToast({
                      title: '申请成功',
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
            } else if (res.cancel) {
              that.setData({ dtDataisShow: false });
            }
          }
        })
      } else if (roleStatus == 4){
        wx.showModal({
          title: '提示',
          content: '正在申请成为店员中...',
          showCancel: false,
          confirmText: '知道了'
        })
        that.setData({ dtDataisShow: false });
      }
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/isStoreWaiter',
        method: 'POST',
        data: Util.json2Form({
          openid: openid,
          store_id: that.data.storeId,
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          wx.setStorageSync('roleStatus', res.data.status);
          if (res.data.status == 3) {
            wx.showModal({
              title: '提示',
              content: '确定加入店铺：' + that.data.store_name,
              success: function (res) {
                if (res.confirm) {
                  wx.request({
                    url: 'https://www.zsjyao.com/index.php/Api/Weixin/addWaiter',
                    method: 'POST',
                    data: Util.json2Form({
                      openid: app.globalData.userOpenId.openid,
                      store_id: that.data.storeId,
                    }),
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res);
                      if (res.data.status == 1) {
                        that.setData({ dtDataisShow: true });
                        wx.showToast({
                          title: '申请成功',
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
                } else if (res.cancel) {
                  that.setData({ dtDataisShow: false });
                }
              }
            })
          } else if (res.data.status == 4) {
            that.setData({ dtDataisShow: false });
            wx.showModal({
              title: '提示',
              content: '正在申请成为店员中...',
              showCancel: false,
              confirmText: '知道了'
            })
          } else if (res.data.status == 2) {
            that.getDtData();//执行大堂页面请求数据
          } else if (res.data.status == 1) {
            that.getDtData();//执行大堂页面请求数据
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
        // complete: function () {
        //   wx.hideLoading()
        // }
      })
    }
    
  },
  //大堂页面请求数据
  getDtData:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/orderMenuStore',
      method: 'POST',
      data: Util.json2Form({
        store_id: that.data.storeId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        if (res.data.status == 1) {
          that.setData({ dtDataisShow: true });
          that.setDtData(data);//执行处理大堂页面数据
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
  //处理大堂页面数据
  setDtData:function(data){
    var arr =[];
    for(var key in data){
      if(typeof data[key]=='object'){
        arr.push(data[key]);
      }
    }
    this.setData({
      dtDataArr:arr,
      store_name: data.store_name
    })
  },
  //大堂页面添加就餐人数-出现弹框
  addNumberHandle:function(e){
    console.log(e);
    var that = this;
    that.setData({
      addNumberIsShow:true,
      tm_id: e.currentTarget.dataset.tm_id
    })
  },
  //输入就餐人数
  numberInput:function(e){
    this.setData({
      eatNumber: e.detail.value
    })
  },
  //添加人数弹框确定
  popConfirmHandle:function(){
    var that = this;
    that.setData({
      addNumberIsShow: false,
    });
    wx.showLoading({
      title: '正在提交',
    })
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
          var tm_id = that.data.tm_id;
          var eatNumber = that.data.eatNumber;
          var arr = that.data.dtDataArr;
          for(var i = 0;i<arr.length;i++){
            if (arr[i].tm_id == tm_id){
              arr[i].eat_number = eatNumber;
            }
          }
          that.setData({ dtDataArr: arr});
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
  popCancelHandle:function(){
    this.setData({
      addNumberIsShow: false,
    })
  },
  //点击已上
  servedHandle:function(e){
    var that = this;
    //console.log(e);
    var id = e.currentTarget.dataset.id;
    var tm_id = e.currentTarget.dataset.tm_id;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateServing',
      method: 'POST',
      data: Util.json2Form({
        id: id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var arr = that.data.dtDataArr;
          for(var i =0;i<arr.length;i++){
            if (arr[i].tm_id == tm_id){
              for (var n = 0; n < arr[i].order_menu.length;n++){
                if (arr[i].order_menu[n].id==id){
                  arr[i].order_menu.splice(n,1);
                }
              }
            }
          }
          that.setData({ dtDataArr:arr});
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
      // complete: function () {
      //   wx.hideLoading()
      // }
    })
  },
  //从大堂页面跳转到已点页面
  //进入店铺中心并且请求数据
  stoteCenterData:function(openId){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getStoreCenter', 
        method: 'POST',
        data: Util.json2Form({ store_id: wx.getStorageSync('store_id')}),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.data;
          if(res.data.status==1){
            that.setData({
              dataCenter: data
            });
            if(data.store_logo){
              that.setData({
                logoImage: 'https://www.zsjyao.com/' + data.store_logo,
              });
            }
          wx.setStorageSync('store_id', data.store_id);
          app.globalData.store_name=data.store_name;
          }else{
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
  //进入店铺菜单并且请求数据
  storeMenuData:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/goods_list',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.storeId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data;
          var bascPri = parseInt(data.meal_fee);
          if (data.goods_list.length == 0){
            that.setData({
              noData: true,
              noDishData: false
            })
          }else{
            that.setData({
              noData: false,
              noDishData: true,
              dataMenu: data,
              st_id: data.store_type[0].st_id,
              bascPri: bascPri
            })
          }
          
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
      // complete: function () {
      //   wx.hideLoading()
      // }
    })
  },
  //菜单页面类型切换
  dishClassHandle:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var st_id = this.data.dataMenu.store_type[index].st_id;
    that.setData({
      st_id:st_id
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/goods_list',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.storeId,
        store_type: st_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res.data.data);
        var data = res.data.data;
        if (res.data.status == 1) {
          if (data.goods_list.length == 0){
            that.setData({
              noData: true,
              noDishData: false
            })
          }else{
            that.setData({
              noData: false,
              noDishData: true,
              dataMenu: data
            })
          }
          
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
  //从店铺菜单跳转到添加菜品页面
  toAddDish: function () {
    wx.navigateTo({
      url: '/pages/add-dish/add-dish'
    })
  },
  //从店铺菜单跳转到修改菜品页面
  toMOdifyDish: function (e) {
    var d = e.currentTarget.dataset;
    var data = 'goodsid=' + d.goodsid + '&goodsimg=' + d.goodsimg + '&goodsname=' + d.goodsname + '&goodsprice=' + d.goodsprice + '&goodstypeid=' + d.goodstypeid + '&ishide=' + d.ishide;
    wx.navigateTo({
      url: '/pages/modify-dish/modify-dish?'+data
    })
  },
  //从店铺中心跳转到完善信息页面
   toModify: function(){
     var data = this.data.logoImage;
      wx.navigateTo({
        url: '/pages/store-modify/store-modify?logoImage=' + data
    })
  },
  //从店铺中心跳转到员工二维码页面
  toStaffManage:function(){
      wx.navigateTo({
        url: '/pages/staff-manage/staff-manage'
      })
    },
    //从店铺中心跳转到餐桌二维码页面
    toTableCode:function(){
      wx.navigateTo({
        url: '/pages/table-code/table-code'
      })
  },
  //从大堂页面跳转到已点页面
  toSelHandle:function(e){
    console.log(e);
    console.log(e.currentTarget.dataset.tableid);
    var data = 'store_id=' + this.data.storeId + '&table_id=' + e.currentTarget.dataset.tableid + '&eat_number=' + e.currentTarget.dataset.eatnumber + '&tm_id=' + e.currentTarget.dataset.tm_id 
    wx.navigateTo({
      url: '../../pages/store-sel/store-sel?'+ data
    })
  },
  //店铺中心跳转到充值页面
  toRecharge: function () {
    wx.navigateTo({
      url: '../../pages/recharge/recharge'
    })
  },
  //用户输入的基本餐位费
  bacePriInput:function(e){
    this.setData({bacePriInput:e.detail.value});
  },
  //弹出基本餐位费弹框
  setBascTablePri:function(){
    var that = this;
    that.setData({ isSetBacePri:true});
  },
  //基本餐位费弹框-取消
  setBacePriCancel:function(){
    var that = this;
    that.setData({ isSetBacePri: false });
  },
  //基本餐位费弹框-确认
  setBacePriConfirm:function(){
    var that = this;
    that.setData({ isSetBacePri: false });
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/setMealFee',
      method: 'POST',
      data: Util.json2Form({
        meal_fee: that.data.bacePriInput,
        store_id: that.data.storeId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({ bascPri: that.data.bacePriInput});
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
  toTodayBespoke:function(){
    wx.navigateTo({
      url: '../../pages/today-bespoke/today-bespoke'
    })
  }
})