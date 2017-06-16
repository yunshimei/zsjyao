// pages/setCard/setCard.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    status:0,
    index:0,
    discountChoseArr: ['请选择折扣'],//折扣选项
    discountArr: [],//折扣选项的所有数据
    amount:'',//充值金额
    year:'',//当前年份
    totle: '',//卡内总数值
    largess: '',//赠送部分
    maxMoney:'',//最大折扣上限
    endDataType: '',//有效时间
    errorInit: '',//错误提示
    setedViptype:[],//已设置的卡型
    vipConunt:null,//已设置的卡型张数
    max_money: '',//获取到的最大折扣上限
    page:0,//当前页数
    memberList:[],//会员列表
    oneMemberList:[],//每次请求回来的会员列表数据
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    money:null,//余额
    totleMoney:null,//余值
    memberNum: null//会员人数
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    that.getVipTypeList();/*** 执行获取已设置过的卡型*/
    that.getdDiscountChose(); /*** 执行获取折扣选项*/
    that.getYear();
  },

  /** * 生命周期函数--监听页面初次渲染完成  */
  onReady: function () {
  
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
  
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {
  
  },

  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {
  
  },

  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
  
  },

  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    var that = this;
    if (this.data.status == 1 && that.data.oneMemberList!=''){
      that.setData({
        searchLoading:true
      })
      that.getMemberList();
    }
  },
  /*** 获取折扣选项*/
  getdDiscountChose:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/discount',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          var data = res.data.data;
          var arr = that.data.discountChoseArr;
          for(var i =0;i<data.length;i++){
            arr.push(data[i].name);
          }
          that.setData({ discountChoseArr:arr,discountArr:data})
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
  /*** 获取当前年份*/
  getYear:function(){
    var date = new Date;
    var year = date.getFullYear(); 
    this.setData({year:year})
  },
  /*** 获取用户选择的折扣选择index*/
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    // this.isViewTotleLargess();//执行判断是否显示相当于赠送和卡内数值
  },
  /*** 获取用户输入的充值金额*/
  amountInput: function (e) {
    this.setData({
      amount: e.detail.value
    })
    // this.isViewTotleLargess();//执行判断是否显示相当于赠送和卡内数值
  },
  /*** 判断是否显示相当于赠送和卡内数值*/
  // isViewTotleLargess:function(){
  //   var that = this;
  //   var amount = that.data.amount;
  //   var index = that.data.index;
  //   var i = index-1;
  //   if(index>0){
  //     var discount = that.data.discountArr[i].discount;
  //   }
  //   if (amount != '' && index!=0){
  //     wx.showLoading({
  //       title: '加载中',
  //     });
  //     wx.request({
  //       url: 'https://www.zsjyao.com/index.php/Api/Weixin/computeRecharge',
  //       method: 'POST',
  //       data: Util.json2Form({
  //         money: amount,
  //         discount: discount
  //       }),
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded'
  //       },
  //       success: function (res) {
  //         if (res.data.status == 1) {
  //           that.setData({
  //             totle: res.data.data.totle,
  //             largess: res.data.data.largess
  //           })
  //         }
  //       },
  //       fail: function (res) {
  //         wx.showModal({
  //           title: '提示',
  //           content: res.errMsg,
  //           showCancel: false,
  //           confirmText: '知道了'
  //         })
  //       },
  //       complete: function () {
  //         wx.hideLoading()
  //       }
  //     })
  //   }
  // },
   /*** 获取用户输入的折扣上限*/
  maxMoneyInput: function (e) {
    this.setData({
      maxMoney: e.detail.value
    })
  },
  /*** 用户有效期选择*/
  radioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      endDataType: e.detail.value
    })
  },
  /*** 发布按钮*/
  vipReleaseHandle:function(){
    var that = this;
    var money = that.data.amount;
    // var totle = that.data.totle;
    // var largess = that.data.largess;
    var type = that.data.endDataType;
    var maxMoney = that.data.maxMoney;
    var index = that.data.index;
    //var i = index - 1;
    if (index > 0) {
      var discount = that.data.discountArr[index - 1].discount;
    }
    if (money==''){
      that.setData({ errorInit:'充值金额不能为空！'})
    } else if (index<=0){
      that.setData({ errorInit: '折扣类型不能为空！' })
    } else if (maxMoney==''){
      that.setData({ errorInit: '抵扣上限不能为空！' })
    } else if (type==''){
      that.setData({ errorInit: '截止时间不能为空！' })
    } else if (that.data.vipConunt >=3) {
      that.setData({ errorInit: '会员卡已达到3张，不能再发布了' })
    }else{
      that.setData({ errorInit: '' });
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/addStoreMembership',
        method: 'POST',
        data: Util.json2Form({
          store_id: wx.getStorageSync('store_id'),
          discount: discount,
          money: money,
          // totle: totle,
          // largess: largess,
          type: type,
          max_money: maxMoney,
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            that.getVipTypeList();/*** 执行获取已设置的卡型*/
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
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
        // complete: function () {
        //   wx.hideLoading()
        // }
      })
    }
  },
  /*** 获取已设置的卡型*/
  getVipTypeList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/storeMembershipList',
      method: 'POST',
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id')
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          var data = res.data.data;
          console.log(data);
          for(var i =0 ;i<data.data.length;i++){
            data.data[i].discount = data.data[i].discount*10;
            data.data[i].money = parseInt(data.data[i].money);
          }
          that.setData({ 
            vipConunt: data.count, 
            setedViptype: data.data, 
            max_money: data.max_money,
            maxMoney: data.max_money
            })
          console.log(that.data.setedViptype);
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
  /*** 导航切换栏*/
  tabNavHandle:function(e){
    var that = this;
    var status = e.currentTarget.dataset.status;
    this.setData({ status: status});
    if(status==1){
      that.getMemberList();
    }
  },
  /*** 获取会员列表*/
  getMemberList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getUserMembershipList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id'),
        p: that.data.page + 1
      }),
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.data.list;
          var arr = that.data.memberList;
          var arr1 = arr.concat(data);
          that.setData({ 
            memberList: arr1, 
            page:that.data.page+1,
            oneMemberList: data,
            money: that.data.money+res.data.data.money,
            totleMoney: that.data.totleMoney +res.data.data.totle,
            memberNum: that.data.memberNum + res.data.data.userCount
            });
            if(data==""){
              that.setData({ searchLoadingComplete: true, searchLoading:false})
            }
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
  /*** 隐藏/显示会员卡*/
  isShowBtn:function(e){
    var that = this;
    var ms_id = e.currentTarget.dataset.ms_id;
    var is_hide = e.currentTarget.dataset.is_hide;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateHide',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: Util.json2Form({
        ms_id: ms_id,
        is_hide: is_hide
      }),
      success: function (res) {
        if (res.data.status == 1) {
          var arr = that.data.setedViptype;
          console.log(arr);
          for(var i = 0;i<arr.length;i++){
            if (arr[i].ms_id == ms_id){
              // if (is_hide==0){
              //   arr[i].is_hide = "1";
              // }else{
              //   arr[i].is_hide = "0";
              // }
              arr[i].is_hide = is_hide;
            }
          }
          that.setData({ setedViptype: arr})
          // that.getMemberList();
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
  }
})