function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



//POST请求格式转换
function json2Form(json) { 
  var str = []; 
  for(var p in json){ 
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p])); 
  } 
  return str.join("&"); 
} 


//获取省 市 区数据
function getArea(that){
  wx.request({
      url : "https://www.zsjyao.com/index.php/Api/Weixin/region",
      method:'POST',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success:function(res){
        var data = res.data.data;
        if(res.data.status==1){
          const provinces = [];
          const citys = [];
          const countys = [];
          for(var i=0;i<data.length;i++){
            provinces.push(data[i]);
          }
          for(var i=0;i<data[0].city.length;i++){
            citys.push(data[0].city[i]);
          }
          var countyArr=data[0].city[0].area;
          for(var i=0;i<countyArr.length;i++){
            countys.push(countyArr[i]);
          }
          that.setData({
            'provinces': provinces,
            'citys':citys,
            'countys':countys,
            //'province':cityData[0].name,
            //'city':cityData[0].sub[0].name,
            //'county':cityData[0].sub[0].sub[0].name
          })
        } 
      },
      fail:function(res){
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

function upload_file(url, filePath, name, formData, success, fail) {
  　　console.log('a=' + filePath);
  　　wx.uploadFile({
    　　　　url: rootUrl + url,
    　　　　filePath: filePath,
    　　　　name: name,
    　　　　header: {
      　　　　　　'content-type': 'nultipart/form-data'
    　　　　},
    　　　　formData: formData,  //http请求中其他额外的form data
    　　　　success: function (res) {
      　　　　　　console.log(res);
      　　　　　　if (res.statusCode == 200 && !res.data.result_code) {
        　　　　　　　　　typeof success == "function" && success(res.data);
      　　　　　　} else {
        　　　　　　　　typeof fail == "function" && fail(res);
      　　　　　　}
    　　　　},
    　　　　fail: function (res) {
      　　　　　　console.log(res);
      　　　　　　typeof fail == "function" && fail(res);
    　　　　}
  　　})
}

function myRequest(url,data,cb){
  wx.request({
        url: url,
        method: 'POST',
        data: Util.json2Form(data),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 1){
            cb(res.data)
          }else{
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


module.exports = { 
 formatTime: formatTime,
 json2Form:json2Form, 
 getArea:getArea,
 req:myRequest
}