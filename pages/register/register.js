//获取应用实例
var Util = require( '../../utils/util.js' );
var app = getApp()
Page({
  data: {
    provinces: ['四川省','贵州省','云南省'],
    province: '',
    citys: ['成都市','广元市','达州市'],
    city: '',
    countys: ['高新区','武侯区','锦江区'],
    county: '',
    finishValue:'',
    value:[0,0,0],
    condition:false,
    uPhone:"",
    errorInit:"",
    phoneIsValid:false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    wx.request({
      url : "https://www.zsjyao.com/ybc/index.php/Api/Weixin/region",
      method:'POST',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success:function(res){
        console.log(res.data);
        var proArr=[];
        if(status==1){
          
        } 
      }
    })
  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  bindChange:function(e){
    console.log(e.detail.value);
  },
  userPhoneInput:function(e){
    var that = this;
    this.setData({
      uPhone:e.detail.value
    })
  },
  /*phoneFinish:function(e){
    var that = this;
    this.setData({
      uPhone:e.detail.value
    });
    var phoneReg = /^1[34578]\d{9}$/;
    var phone = this.data.uPhone;
    if(phone==""){
        this.setData({
          errorInit:"温馨提示：手机号不能为空！"
        })
    }else if(!(phoneReg.test(phone))){
      this.setData({
          errorInit:"温馨提示：您输入的手机号不正确！"
        })
    }else{
      this.setData({
          errorInit:""
        });
      wx.request({
        url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/isRegister', 
        method: 'POST',
        data: Util.json2Form({mobile:this.data.uPhone}),
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success: function(res) {
          console.log(JSON.stringify(res));
          if(res.data.status==1){
            that.setData({
              phoneIsValid:true
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
  },*/
  phoneFinish:function(e){
    var that = this;
    this.setData({
      uPhone:e.detail.value
    });
  },
  gainCode:function(e){
    var that = this;
    console.log(this.data.phoneIsValid);
    var phoneReg = /^1[34578]\d{9}$/;
    var phone = that.data.uPhone;
    console.log(phone);
    if(phone==""){
      this.setData({
          errorInit:"温馨提示：手机号不能为空！"
      })
    }else if(!(phoneReg.test(phone))){
      this.setData({
          errorInit:"温馨提示：您输入的手机号不正确！"
        })
    }else{
      this.setData({
          errorInit:""
      });
      wx.request({
        url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/isRegister', 
        method: 'POST',
        data: Util.json2Form({mobile:this.data.uPhone}),
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success: function(res) {
          if(res.data.status==1){
            that.setData({
              phoneIsValid:true
            });
            wx.request({
              url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/send_validate_code', 
              method: 'POST',
              data: Util.json2Form({mobile:this.data.uPhone}),
              header: {'content-type': 'application/x-www-form-urlencoded'},
              success: function(res) {
                console.log(res.data);
                      wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail:function(res){
                wx.showToast({
                  title: '错误',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
    /*if(this.data.phoneIsValid){
      wx.request({
        url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/send_validate_code', 
        method: 'POST',
        data: Util.json2Form({mobile:this.data.uPhone}),
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success: function(res) {
          console.log(res.data);
                wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail:function(res){
          wx.showToast({
            title: '错误',
            icon: 'success',
            duration: 2000
          })
        }
      })

    }else{
      this.setData({
          errorInit:"温馨提示：请输入正确的手机号！"
        })
    }*/
  }
})