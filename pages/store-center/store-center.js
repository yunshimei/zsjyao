Page({
  data:{
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    wx.request({
      url: 'https://www.zsjyao.com/ybc/index.php/Api/Weixin/test', //仅为示例，并非真实的接口地址
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
      }
    })
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
  toModify: function(){
      wx.navigateTo({
      url: '/pages/store-modify/store-modify'
    })
  },
  toStaffManage:function(){
    wx.navigateTo({
      url: '/pages/staff-manage/staff-manage'
    })
  },
  toTableCode:function(){
    wx.navigateTo({
      url: '/pages/table-code/table-code'
    })
  },
  toRecharge:function(){
    wx.navigateTo({
      url: '/pages/recharge/recharge'
    })
  }
})