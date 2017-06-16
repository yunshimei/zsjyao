// pages/modify-dish/modify-dish.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    //goodsimg: '/images/add-dish.jpg',
    goods_img: '',
    dishClassArr: [],//菜品所有类别
    objdishClass: [],//菜品类别对象
    isHide:false,
    isDel:false,
    hideTip:'是否隐藏',
    index: null
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
    this.setData({
      goodsid: options.goodsid,
      goodsimg: options.goodsimg,
      goods_img: 'https://www.zsjyao.com/' + options.goodsimg,
      goodsname: options.goodsname,
      goodsprice: options.goodsprice,
      goodstypeid: options.goodstypeid,
      ishide: options.ishide
    })
    if(options.ishide==1){
      that.setData({ hideTip:'已隐藏',isHide:true})
    }
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/getStoreType',
      method: 'POST',
      data: Util.json2Form({
        store_id: this.data.storeId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        if (res.data.status == 1) {
          var arr = [];
          var index = 0;
          for (var i = 0; i < data.length; i++) {
            arr.push(data[i].st_name);
            if (options.goodstypeid == data[i].st_id) index = i;
          }
          that.setData({
            dishClassArr: arr,
            objdishClass: data,
            index: index
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
      }
    })
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //客户选择菜品类别
  bindPickerChanges: function (e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  //用户输入菜品名字
  dishNameInput: function (e) {
    this.setData({
      goodsname: e.detail.value
    })
  },
  //用户输入菜品价格
  dishPriceInput: function (e) {
    this.setData({
      goodsprice: e.detail.value
    })
  },
  choseDishImage: function () {
    var that = this;
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: "https://www.zsjyao.com/index.php/Api/Weixin/upload_goods_image", // 你的接口地址
          filePath: tempFilePaths[0],
          name: "image",
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            //'user': 'test'
          },
          success: function (res) {
            console.log(222);
            var data = JSON.parse(res.data);
            if (data.status == 1) {
              console.log(data);
              that.setData({
                goods_img: 'https://www.zsjyao.com/' + data.url,
                goodsimg: data.url,
              })
            } else {
              that.setData({
                errorInit: '图片太大'
              }) 
            }

          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示错误',
              content: res.errMsg,
              showCancel: false,
              confirmText: '知道了'
            })
          }
        })
      },
    })
  },
  modifyDishHandle:function(){
    wx.request({
      url: 'https://www.zsjyao.com/index.php/Api/Weixin/editGoods',
      method: 'POST',
      data: Util.json2Form({
        goods_id: this.data.goodsid, 
        store_id: this.data.storeId, 
        goods_name: this.data.goodsname, 
        shop_price: this.data.goodsprice, 
        store_type_id1: this.data.goodstypeid, 
        original_img: this.data.goodsimg
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
      fail: function () {
        wx.showModal({
          title: '提示',
          content: res.errMsg,
          showCancel: false,
          confirmText: '知道了'
        })
      }
    })
  },
  //是否隐藏菜品
  hideHandle:function(){
    var that = this;
    this.setData({
      isHide:!this.data.isHide
    });
    var hide = null;
    if(this.data.isHide==true){
      hide = 1;
      wx.showModal({
        title: '提示',
        content: '确定隐藏此菜品吗？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isHide: true
            })
            wx.request({
              url: 'https://www.zsjyao.com/index.php/Api/Weixin/hideGoods',
              method: 'POST',
              data: Util.json2Form({
                goods_id: that.data.goodsid,
                hide: hide
              }),
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '隐藏成功',
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
              fail: function () {
                wx.showModal({
                  title: '提示',
                  content: res.errMsg,
                  showCancel: false,
                  confirmText: '知道了'
                })
              }
            })
          } else if (res.cancel) {
            that.setData({
              isHide: false
            })
          }
        }
      })
    } else if (this.data.isHide == false){
      hide = 0;
      wx.showModal({
        title: '提示',
        content: '确定显示此菜品吗？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isHide: false
            })
            wx.request({
              url: 'https://www.zsjyao.com/index.php/Api/Weixin/hideGoods',
              method: 'POST',
              data: Util.json2Form({
                goods_id: that.data.goodsid,
                hide: hide
              }),
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '显示成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '显示失败',
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
              }
            })
          } else if (res.cancel) {
            that.setData({
              isHide: true
            })
          }
        }
      })
    }   
  },
  //是否删除菜品
  delDishHandle:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除此菜品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.zsjyao.com/index.php/Api/Weixin/delGoods',
            method: 'POST',
            data: Util.json2Form({
              goods_id: that.data.goodsid,
              del: 1
            }),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '删除失败',
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
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})