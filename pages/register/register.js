//获取应用实例
var Util = require( '../../utils/util.js' );
var app = getApp();
Page({
  data: {
    finishValue:'',
    uPhone:"",
    errorInit:"",
    phoneIsValid:false,
    codeTip:"获取验证码",
    codeBtnDisabled:false,
    session_id: '',
    cont : 60
  },
  //禁止此页下拉刷新
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    app.getUserOpenId();//调用获取useropenid的函数
  },
  //用户输入手机号后
  userPhoneInput:function(e){
    this.setData({
      uPhone:e.detail.value
    })
  },
  //点击获取验证码
  getCodeHandle:function(){
    var that = this;
    var phone = that.data.uPhone;
    var phoneReg = /^1[34578]\d{9}$/;
    if (phone == '') {
      that.setData({
        errorInit: '手机号不能为空！'
      })
    } else if (!(phoneReg.test(phone))) {
      that.setData({
        errorInit: '您输入的手机号不正确！'
      })
    }
    else {
      var cont = that.data.cont;
      if (cont == 60) {
        wx.request({
          url: 'https://www.zsjyao.com/index.php/Api/Weixin/send_validate_code',
          method: 'POST',
          data: Util.json2Form({
            mobile: this.data.uPhone,
            reg: 1,
          }),
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.status == 1) {
              that.setData({
                session_id: res.data.session_id
              })
              var timer = setInterval(function () {
                cont--;
                that.setData({
                  codeTip: '重新获取(' + cont + 's)'
                })
                if (cont <= 0) {
                  cont = 60;
                  clearInterval(timer);
                  timer = null;
                  that.setData({
                    codeTip: '点击发送验证码'
                  })
                }
              }, 1000);
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                confirmText: '知道了'
              })
            }
          }
        })
      }
    }
  },
  //用户输入验证码后
  codeHandle:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  //点击入驻按钮
  submitHandler:function(){

    var phone = this.data.uPhone;
    var code = this.data.code;
    var phoneReg = /^1[34578]\d{9}$/;
    var codeReg = /^\d{4}$/;
    if (phone == ''){
      this.setData({
        errorInit: '手机号不能为空！'
      })
    } else if (!(phoneReg.test(phone))) {
      that.setData({
        errorInit: '您输入的手机号不正确！'
      })
    }else if(code==''){
      that.setData({
        errorInit: '验证码不能为空！'
      })
    } else if (!(codeReg.test(code))) {
      that.setData({
        errorInit: '您输入的验证码不正确'
      })
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/sellerRegister',
        method: 'POST',
        data: Util.json2Form({
          session_id: this.data.session_id,
          openid: app.globalData.userOpenId.openid,
          seller_name: this.data.uPhone,
          code: this.data.code,
        }),
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 1) {
            wx.setStorageSync('store_id', res.data.store_id);
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateTo({
              url: '/pages/store/store?status=5'
            });
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText:'知道了'
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
    
    // var status = 1;
    // if (status == 1) {
    //   wx.redirectTo({
    //     url: '/pages/store/store?status=5'
    //   });
    // }
  },
})