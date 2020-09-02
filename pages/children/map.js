// pages/children/map.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    includePoints: [],
    fieldList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取事件对象
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('content', ({ name, location, fieldList }) => {
      wx.setNavigationBarTitle({
        title: name,
      })

      let [latitude, longitude] = location.split(',')
      this.setData({
        longitude,
        latitude,
        markers: [{
          longitude,
          latitude,
          id: 1,
          callout: {
            content: name,
            display: 'ALWAYS',
            padding: 10,
            borderRadius: 5
          }
        }],
        fieldList: fieldList
      }, () => {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            const latitude = res.latitude
            const longitude = res.longitude
            this.setData({
              includePoints: [...this.data.markers, { latitude, longitude }],
              polyline: [{ points: [...this.data.markers, { latitude, longitude }] }],
            })
          }
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  itemClick({ currentTarget: { dataset: { item } } }) {
    if (item.type === 'tel') {
      wx.makePhoneCall({
        phoneNumber: item.value,
      })
    }
  },
  markertap(e) {
    console.log(e.detail.markerId)
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