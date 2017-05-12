Page({
  data:{
    array: ['火锅', '荤菜', '素菜', '酒水'],
    objectArray: [
      {
        id: 0,
        name: '火锅'
      },
      {
        id: 1,
        name: '荤菜'
      },
      {
        id: 2,
        name: '素菜'
      },
      {
        id: 3,
        name: '酒水'
      }
    ],
    index: 0,
    date: '2016-09-01',
    time: '12:01'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
 
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})