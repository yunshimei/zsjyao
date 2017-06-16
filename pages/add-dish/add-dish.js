var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    dishClassArr: [],//菜品所有类别
    objdishClass: [],//菜品类别对象
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    dishClass:'',//菜品类别
    dishName:'',//菜品名称
    dishPrice:'',
    dishImage:'/images/add-dish.jpg',
    imageUrl:'',
    errorInit: '',
    imgSizeTip:''
  },
  onShow:function(options){
    // 生命周期函数--监听页面加载
    var that = this;
    this.setData({
      storeId: wx.getStorageSync('store_id')
    });
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
          var data = res.data.data;
          var arr = [];
          for(var i=0;i<data.length;i++){
            arr.push(data[i].st_name);
          }
          that.setData({
            dishClassArr:arr,
            objdishClass:data
          })
        } 
        // else {
        //   wx.showModal({
        //     title: '提示',
        //     content: res.data.msg,
        //     showCancel: false,
        //     confirmText: '知道了'
        //   })
        // }
      }
    })
    
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
   
  },
  onLoad:function(){
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
  //跳转到添加类别页面
  addDishClass:function(){
    wx.navigateTo({
      url: '/pages/add-dish-class/add-dish-class'
    })
  },
  //用户输入菜品名字
  dishNameInput:function(e){
    this.setData({
      dishName: e.detail.value
    })
  },
  //用户输入菜品价格
  dishPriceInput: function (e) {
    this.setData({
      dishPrice: e.detail.value
    })
  },
  //客户选择菜品类别
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  choseDishImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
            var data = JSON.parse(res.data);
            if(data.status == 1){   
              console.log(data);
              that.setData({
                dishImage: 'https://www.zsjyao.com/'+data.url,
                imageUrl: data.url
              })
            }else{
              that.setData({
                errorInit:'图片'
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

  chooseImageTap: function () {
    　　　　let _this = this;
    　　　　wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#f7982a",
            success: function (res) {
              if (!res.cancel) {
                if (res.tapIndex == 0) {
                  _this.chooseWxImage('album')
                } else if (res.tapIndex == 1) {
                  _this.chooseWxImage('camera')
                }
              }
            }
    　　　　})
  },
  chooseWxImage: function (type) {
    　　　let _this = this;
    　　　wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
              _this.setData({
                dishImage: res.tempFilePaths[0],
              })
            }
          })
  },
  addDishHandle:function(){
    //Util.upload_file('https://www.zsjyao.com/index.php/Api/Weixin/addGoods', this.data.dishImage,'name','',)
    var that = this;
    var goods_name = this.data.dishName;
    var index = this.data.index;
    var store_type_id1 = this.data.objdishClass[index].st_id;
    var shop_price = this.data.dishPrice;
    var original_img = this.data.imageUrl;
    if (goods_name ==''){
      this.setData({
        errorInit: '菜品名称不能为空'
      })
    } else if (store_type_id1==''){
      this.setData({
        errorInit: '菜品类别不能为空'
      })
    } else if (shop_price==''){
      this.setData({
        errorInit: '菜品类别不能为空'
      })
    }else{
      wx.request({
        url: 'https://www.zsjyao.com/index.php/Api/Weixin/addGoods',
        method: 'POST',
        data: Util.json2Form({
          store_id: this.data.storeId,
          goods_name: goods_name,
          shop_price: shop_price,
          store_type_id1: store_type_id1,
          original_img: original_img
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            });
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