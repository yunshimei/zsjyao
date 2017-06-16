// pages/client/client.js
var Util = require('../../utils/util.js');
var app = getApp();
var timer = null;//定时器
Page({
  data:{
    status:0,//底部切换状态
    store_id: 3,//店铺ID
    table_id: 2,//餐桌ID
    openid:'',//openid
    role:null,//角色
    dataMenu: {},//店铺菜品列表和分类列表
    noData: false,//没有菜品的显示暂无数据
    noDishData: true,//有菜品的情况
    st_id: '',//菜品类型
    selArr: [],//获取已选择菜品数组
    selNum:{},//重新组织的已选菜品ID和数量对象
    selHeight:null,//点菜页面已点栏的高度
    selCol:null,
    userInfo:null,//用户信息
    tm_id:null,
    store_name:null,
    selData:{
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
      duration: 1000,    
    },//轮播图片数据
    dishList: [],//提交订单后的订单列表数据
    totalNum:'',//已点页面点菜总数量
    totalPrice:'',//已点页面总价
    isPayment:false,//是否付款
    myData:{},
    selBarFixed: '',  //菜单页顶部固定的class名;
    tableNumList:[],//餐桌成员列表
    storeVipCard:null,//店铺会员卡信息
    selVipCoupon:null,//我的页面优惠券和会员卡
    severType:''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // this.webSocketConnect();
    console.log(options);
    var that = this;
    var status=null;
    var severType='';
    if(options.status){
      status = options.status;
    }else{
      status=0;
    }
    var table_id='';
    if(options.table_id){
      table_id=options.table_id;
    }else{
      table_id=1
    }
    if (options.severType){
      severType = options.severType
    }else{
      severType=""
    }
    this.setData({ 
      //store_id: options.store_id, 
      //table_id: options.table_id,
      table_id:table_id,
      role:3,
      status: status,
      severType: severType,
      openid: wx.getStorageSync('openid')
    })//通过页面跳转获取店铺ID和餐桌号
    app.getUserOpenId(this.clientRegister);//获取openId后执行普通用户注册
    this.storeInfoHandle();//进入页面调用获取店铺菜品函数
    if(this.data.status==2){
      this.getMyVipCard();//进入我的页面请求我的一张会员卡
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    console.log('show');
    var that = this;
    if (that.data.status == 0) {
      timer = setInterval(that.getSelDish, 2000);//启动定时器
    }
  },
  onHide:function(){
    // 页面隐藏
    // console.log('hide');
    // wx.closeSocket()
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 已关闭！')
    // })
    clearInterval(timer);//停止定时器
  },
  onUnload:function(){
    //页面 关闭
    // wx.closeSocket()
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 已关闭！')
    // })
    clearInterval(timer);//停止定时器
  },
  //webSocket链接
  // webSocketConnect:function(){
  //   wx.connectSocket({
  //     url: 'wss://www.zsjyao.com/sockets',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     method: "GET",
  //   })
  // },
  //webSocket数据交互
  // webSocketSend:function(){
  //   var that = this;
  //   var tm_id = this.data.dataMenu.tm_id;
  //   wx.sendSocketMessage({
  //     data: ''+tm_id,
  //     success: function (res) {
  //       // success
  //     },
  //     fail: function () {
  //       // fail
  //     },
  //     complete: function () {
  //       // complete
  //     }
  //   })
  //   wx.onSocketMessage(function (res) {
  //     //console.log('收到服务器内容：' + res.data);
  //     var obj = JSON.parse(res.data);
  //     that.setSelData(obj);
  //     that.setData({selArr:obj});
  //   })
    
  //   wx.onSocketError(function (res) {
  //     //var that = this;
  //     that.webSocketConnect();
  //   }) 
  // },
  // //webSocket关闭链接
  // webSocketClose:function(){
  //   //wx.onSocketOpen(function () {
  //     //console.log('WebSocket连接已打开！')
  //     wx.closeSocket()
  //   //})
  //   wx.onSocketClose(function (res) {
  //     console.log('WebSocket 已关闭！')
  //   })
  // },
  //ajax轮训数据
  
  //页面跳转函数
  navHandle:function(e){
    var that = this;
    var status = e.target.dataset.status
    this.setData({
      status: status
    })
    if(status==0){
      this.getSelDish(); //进入菜点页面请求已选菜单数据
      timer = setInterval(that.getSelDish, 2000);//启动定时器
    }else if(status==1){
      this.selHandle();//进入已点页面请求已点数据
      this.getStoreVipCard();//进入已点页面请求店铺会员卡
      this.getTableNumList();//进入已点页面请求餐桌成员数据
      clearInterval(timer);  //停止定时器
    }else if(status==2){
      this.getMyVipCard();//进入我的页面请求我的一张会员卡
      clearInterval(timer);//停止定时器
    }
  },
  //普通用户注册
  clientRegister: function (openId) {
    var that = this;
    //var openid = app.globalData.userOpenId.openid;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/userRegister',
        method: 'POST',
        data: Util.json2Form({
          openid: openId,
          nickname: that.data.userInfo.nickName,
          head_pic: that.data.userInfo.avatarUrl,
          province: that.data.userInfo.province.toLowerCase() + 'sheng',
          city: that.data.userInfo.city.toLowerCase(),
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
   
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
    })
  },
  //加入就餐成员列表
  addDiningList:function(){
    var that = this;
    var openid = '';
    if (wx.getStorageSync('openid')){
      openid = wx.getStorageSync('openid');
    }else{
      openid = app.globalData.userOpenId.openid;
    }
    if (!that.data.severType){
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateTableMenuUser',
        method: 'POST',
        data: Util.json2Form({
          openid: openid,
          tm_id: that.data.dataMenu.tm_id
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

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
  //进入页面获取店铺菜品
  storeInfoHandle:function(){
    var that = this;
    //that.webSocketSend();
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/menu_list',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.store_id,
        table_id: this.data.table_id,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data;
          that.setData({
            dataMenu: data,
            st_id: data.store_type[0].st_id,  
            tm_id:data.tm_id,
            store_name: data.store_name
          });
          that.addDiningList();//加入就餐成员列表
          that.getSelDish();//执行获取已点菜品函数
          if (data.goods_list.length == 0) {
            that.setData({
              noData: true,
              noDishData: false
            })
          } else {
            that.setData({
              noData: false,
              noDishData: true,           
            });
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
  //获取已点的菜品
  getSelDish:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/already_menu',
      method: 'POST',
      data: Util.json2Form({
        tm_id: that.data.dataMenu.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('123');
        var data = res.data.data;
        if (res.data.status == 1) {
          // that.webSocketSend();
          // timer = setInterval(that.getSelDish, 2000);//启动定时器
          that.setData({
            selArr:data
          })
        that.setSelData(data);//执行组织已点数据
        
        that.getSelBarHeigth(); //执行计算已点栏高度函数
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '知道了'
          })
        }
      },
      // fail: function (res) {
      //   console.log(111);
      //   wx.showModal({
      //     title: '提示',
      //     content: res.errMsg+'1',
      //     showCancel: false,
      //     confirmText: '知道了'
      //   })
      // },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  //组织已点数据
  setSelData:function(data){
    var selNum={};
    for(var i=0;i<data.length;i++){
      if(data[i].number>0){
        selNum[data[i].goods_id]=data[i].number;
      }
    }
    this.setData({
      selNum:selNum
    })
  },
  //切换菜品分类
  dishClassHandle: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var st_id = this.data.dataMenu.store_type[index].st_id;
    that.setData({
      st_id: st_id
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/menu_list',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.store_id,
        st_id: st_id,
        table_id: this.data.table_id

      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        //console.log(data);
        if (res.data.status == 1) {
          if (data.goods_list.length == 0) {
            that.setData({
              noData: true,
              noDishData: false
            })
          } else {
            that.setData({
              noData: false,
              noDishData: true,
              dataMenu: data,
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
  //点菜
  submitDishHandle:function(e){
    var that = this;
    var sign = e.target.dataset.sign;
    if(sign==-1&&e.target.dataset.num<0){
      return;
    }
    var handleStyle = e.target.dataset.handlestyle;
    var index = e.currentTarget.dataset.index;
    var tm_id = that.data.dataMenu.tm_id;
    var openid = app.globalData.userOpenId.openid;
    var goods_id=null;
    if (handleStyle=="img"){
      goods_id = this.data.dataMenu.goods_list.img[index].goods_id;
    } else if (handleStyle == "null_img"){
      goods_id = this.data.dataMenu.goods_list.null_img[index].goods_id;
    }
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/addMenu',
      method: 'POST',
      data: Util.json2Form({
        tm_id: tm_id,
        openid: openid,
        goods_id: goods_id,
        goods_number: 1,
        sign: sign
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          // that.webSocketSend();
          var arr = that.data.selArr;
          if(res.data.data){
            var flog = false;
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].goods_id == data.goods_id) {
                flog = true;
                if(data.goods_number<=0){
                  arr.splice(i,1);
                }else{
                arr[i].number = data.goods_number
                }
              }
            };
          }else{
            for(var n=0;n<arr.length;n++){
              if (goods_id==arr[n].goods_id){
                arr.splice(n, 1);
              }
            }
          }
          if(!flog&&res.data.data){
            arr.push({
              id:data.id,
              goods_id:data.goods_id,
              goods_name:data.goods_name,
              number:data.goods_number
            });
          }
          that.setData({
            selArr:arr
          })
          that.setSelData(arr);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '知道了'
          })
        }
        //console.log(that.data.selArr);
        that.getSelBarHeigth();
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
  //提交菜单
  submitselHandle:function(){
    var that = this;
    var selArr = this.data.selArr;
   if(selArr.length>0){
     wx.showLoading({
       title: '正在提交',
     })
     wx.request({
       url: 'https://www.zsjyao.com/index.php/Api/Customer/sub_menu',
       method: 'POST',
       data: Util.json2Form({
         tm_id: this.data.dataMenu.tm_id,
       }),
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         console.log(res);
         var data = res.data.data;
         if (res.data.status == 1) {
           clearInterval(timer);//停止定时器
           if (that.data.severType){
             wx.navigateBack({
               delta: 1
             })
           }else{
             that.setData({ status: 1,})
           }
           that.setData({
             selArr: [],
             selNum: {},
           });
           that.setdishListHandle(data);//执行处理提交的菜品列表数据函数
           that.getSelBarHeigth();//执行处理菜单页面已点栏高度函数
           that.selHandle();//执行进入已点页面请求已点数据
           that.getTableNumList();//执行已点页面获取餐桌成员
           that.getStoreVipCard();//进入已点页面请求店铺会员卡
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
   }else{
     wx.showModal({
       title: '提示',
       content: '你还没点菜，快去点菜吧 ^_^ ',
       showCancel: false,
       confirmText: '知道了'
     })
   }
    
  },
    //计算已点栏的高度
  getSelBarHeigth:function(){
    var arr = this.data.selArr;
    var col = Math.ceil(arr.length/3);
    var height = col*25;
    this.setData({
      selHeight:height
    })
  },
  //进入已点页面请求已点数据
  selHandle:function(){
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
        tm_id: this.data.dataMenu.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
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
      },
      // complete: function () {
      //   wx.hideLoading()
      // }
    })
  },
  //处理提交的菜品列表数据
  setdishListHandle:function(data){
    var arr=[];
    for(var key in data){
      if(typeof data[key]=='object'){
        arr.unshift(data[key]);
      }
    }
    this.setData({
      dishList:arr,
      totalNum: data.menu_num,
      totalPrice: data.menu_price,
      num_peo: data.num_peo
    })
  },
  //已点页面获取餐桌成员
  getTableNumList:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/userList',
      method: 'POST',
      data: Util.json2Form({
        tm_id: that.data.dataMenu.tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          that.setData({
            tableNumList:data
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
  //跳转到已点详情页面
  toSelDefault:function(){
    var data = 'store_id=' + this.data.store_id + '&table_id=' + this.data.table_id + '&role=' + this.data.role + '&tm_id=' + this.data.dataMenu.tm_id;
    wx.navigateTo({
      url: '/pages/sel-detail/sel-detail?'+data
    })
  },
  //支付接口
  zfHandle:function(){
    //openid: app.globalData.userOpenId.openid;
    //console.log(openid)
    var that = this;
    if (!that.data.isPayment){
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Customer/customer_pays',
        method: 'POST',
        data: Util.json2Form({
          openid: app.globalData.userOpenId.openid,
          tm_id: this.data.dataMenu.tm_id
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          var data = res.data.data;
          if (res.data.status == 1) {
            wx.requestPayment({
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  });
                  that.setData({
                    isPayment: true
                  })
                }
              },
              'fail': function (res) {
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                    image: '/images/tip-icon.png',
                    duration: 2000
                  })
                }
              }
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
  //滚动到100px事件
  scrollToupper:function(e){
    if(e.detail.scrollTop >= 100) {
      this.setData({selBarFixed: 'sel-bar-fixed'});
    }else {
      this.setData({selBarFixed: ''});
    }
  },
  //进入已点页面获取店铺会员卡
  getStoreVipCard:function(){
    var that = this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getStoreMembership',
      method: 'POST',
      data: Util.json2Form({
        store_id: that.data.store_id,
        sign:1
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data;
          data.list.discount = data.list.discount*10
          that.setData({ storeVipCard: res.data.data.list})
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
  //跳转到会员卡办理页面
  toVipCardHandle:function(){
    wx.navigateTo({
      url: '/pages/vip-handle/vip-handle?store_id=' + this.data.store_id
    })
  },
  //我的页面获取会员卡信息
  getMyVipCard:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/getMembershipList',
      method: 'POST',
      data: Util.json2Form({
        openid: wx.getStorageSync('openid'),
        sign: 1
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data;
          console.log(data);
          data.coupon.condition = parseInt(data.coupon.condition);
          data.coupon.money = parseInt(data.coupon.money);
          data.mslist.discount = data.mslist.discount*10;
          data.mslist.money = parseInt(data.mslist.money);
          that.setData({
            selVipCoupon:data
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
  },
  //我的页面跳转到优惠券列表页面
  toCouponList: function () {
    wx.navigateTo({
      url: '/pages/client-couponList/client-couponList?store_id=' + this.data.store_id
    })
  },
  //我的页面跳转到会员卡列表页面
  toVipList: function () {
    wx.navigateTo({
      url: '/pages/client-vipCard/client-vipCard?store_id=' + this.data.store_id
    })
  },
  //我的页面跳转到该店铺的会员卡和优惠券列表页面
  toStoreCardInfo:function(e){
    var store_id = e.currentTarget.dataset.store_id;
    wx.navigateTo({
      url: '/pages/my-card-list/my-card-list?store_id=' + store_id
    })
  },
  //跳转到买单页面
  toPayBill:function(e){
    console.log(e);
    var that = this;
    var tm_id = e.currentTarget.dataset.tm_id;
    var store_id = this.data.store_id;
    var store_name = e.currentTarget.dataset.store_name
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Customer/addOrder',
      method: 'POST',
      data: Util.json2Form({
        openid: that.data.openid,
        tm_id: tm_id
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/pay-bill/pay-bill?store_id=' + store_id + '&tm_id=' + tm_id + '&store_name=' + store_name + '&order_id=' + res.data.order_id
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
  }
})