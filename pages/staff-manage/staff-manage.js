var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    staffCode:'',//员工二维码
    CurrentStaff:[],//当前员工
    staffApply:[]//正在申请的员工
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.getStaffCode();//执行获取员工二维码
    this.getCurrentStaff();//执行获取当前员工数据
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
  //获取员工二维码
  getStaffCode:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Qrcode/StaffQrcode',
      method: 'POST',
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id')
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            staffCode:res.data.data
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
  //获取员工列表
  getCurrentStaff:function(){
    var that= this;
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getWaiterList',
      method: 'POST',
      data: Util.json2Form({
        store_id: wx.getStorageSync('store_id')
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data
        if (res.data.status == 1) {
          that.setData({
            CurrentStaff: data.formal,
            staffApply: data.apply
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
  //加入员工
  addStaffHandle:function(e){
    var that = this;
    var staffId = e.currentTarget.dataset.staffid;
    var status = e.currentTarget.dataset.status;
    if (status==1){
      wx.showModal({
        title: '确认操作',
        content: '确认加入该店员吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.zsjyao.com/index.php/Api/Weixin/approvalWaiter',
              method: 'POST',
              data: Util.json2Form({
                id: staffId,
                status: status
              }),
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.getCurrentStaff();
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
          } else if (res.cancel) {

          }
        }
      })
    }else if(status==3){
      wx.showModal({
        title: '确认操作',
        content: '确认拒绝该店员的加入吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.zsjyao.com/index.php/Api/Weixin/approvalWaiter',
              method: 'POST',
              data: Util.json2Form({
                id: staffId,
                status: status
              }),
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.getCurrentStaff();
                if (res.data.status == 1) {
                  that.setStaffAddData(staffId,status);
                  wx.showToast({
                    title: '拒绝成功',
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
              },
              complete: function () {
                wx.hideLoading()
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  //删除员工
  delStaffHandle:function(e){
    var that = this;
    var staffId = e.currentTarget.dataset.staffid;
    wx.showModal({
      title: '确认操作',
      content: '确认删除该店员吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.zsjyao.com/index.php/Api/Weixin/approvalWaiter',
            method: 'POST',
            data: Util.json2Form({
              id: staffId,
              status: 2
            }),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.status == 1) {
                //that.setStaffAddData(staffId,status);
                that.getCurrentStaff();
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
            },
            complete: function () {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  }
  //处理同意或拒绝某员工加入的数据
  // setStaffAddData: function (data, status){
  //   var arr = this.data.staffApply;
  //   var arr1 = this.data.CurrentStaff;
  //   if (status = 1){
  //     for(var i =0;i<arr.length;i++){
  //       if (arr[i].id == data) {
  //         arr.splice(i, 1);
  //         break;
  //       }
  //     }
  //     this.setData({ staffApply: arr });
  //   } else if (status = 3){
  //     for (var i = 0; i < arr.length; i++) {
  //       if (arr[i].id == data) {
  //         arr.splice(i, 1);
  //         break;
  //       }
  //     }
  //     this.setData({ staffApply: arr });
  //   }
  // }
})