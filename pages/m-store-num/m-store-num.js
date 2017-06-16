var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    codeTip:'获取验证码',
    uPhone:'',
    storeIdCard:'',
    storeCode:'',
    cont :60,
    errorInit:'',
    session_id:''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      seller_name: options.seller_name,
      card_id: options.card_id.substring(options.card_id.length - 6, options.card_id.length)
    })
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
    app.getUserOpenId();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  //获取用户输入的手机号
  phoneInput:function(e){
    this.setData({
      uPhone: e.detail.value
    })
  },
  //获取用户输入的身份证后6位
  IdCardInput:function(e){
    this.setData({
      storeIdCard: e.detail.value
    })
  },
  //获取用户输入的验证码
  codeInput: function (e) {
    this.setData({
      storeCode: e.detail.value
    })
  },
  //获取验证码
  getCodeHandle: function () {
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
      that.setData({
        errorInit: ''
      })
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
            console.log(res);
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
  //点击提交按钮
  submitHandle:function(){
    var that = this;
    var phone = that.data.uPhone;
    var phoneReg = /^1[34578]\d{9}$/;
    var idCard = that.data.storeIdCard;
    var icCardReg = /^\d{1}((0[1-9])|([1-2]\d)|(3[0|1]))\d{3}$|^((0[1-9])|([1-2]\d)|(3[0|1]))\d{3}([0-9]|X)$/;
    var code = that.data.storeCode;
    var codeReg = /^\d{4}$/;
    if (phone == '') {
      that.setData({
        errorInit: '手机号不能为空！'
      })
    } else if (!(phoneReg.test(phone))) {
      that.setData({
        errorInit: '您输入的手机号不正确！'
      })
    }else if(idCard == ''){
      that.setData({
        errorInit: '身份证号不能为空！'
      })
    }else if (!(icCardReg.test(idCard))) {
      that.setData({
        errorInit: '您输入的身份证号不正确！'
      })
    } else if (!(codeReg.test(code))) {
      that.setData({
        errorInit: '您输入的验证码不正确！'
      })
    }else{
      that.setData({
        errorInit: ''
      })
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/updateSellerName',
        method: 'POST',
        data: Util.json2Form({
          session_id: this.data.session_id,
          openid: app.globalData.userOpenId.openid,
          cart: this.data.storeIdCard,
          mobile: this.data.uPhone,
          code: this.data.storeCode
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
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
  }
})