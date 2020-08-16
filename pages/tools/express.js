// pages/tools/express.js
import http from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressValue: '75378719795397'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindInputChange(e) {
    this.setData({
      expressValue: e.detail.value
    })
  },
  onSearch() {
    let value = this.data.expressValue
    wx.request({
      url: 'https://m.kuaidi100.com/result.jsp?nu=' + value,
      success: ({ cookies }) => {
        let cookie = cookies.map(item => item.split(';')[0]).join(';')
        http.post({
          url: 'https://m.kuaidi100.com/apicenter/kdquerytools.do?method=autoComNum&text=' + value,
        }).then(result => {
          wx.request({
            method: 'post',
            url: 'https://m.kuaidi100.com/query',
            data: {
              postid: value,
              type: result.auto[0].comCode,
              platform: 'MWWW',
              temp: '0.+16位随机数字',
            },
            header: {
              cookie,
              'Referer': 'https://m.kuaidi100.com/result.jsp?nu=' + value,
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              console.log(cookie, result, res)
            }
          })
        })
      },
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})