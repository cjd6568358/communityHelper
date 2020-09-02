// pages/children/map.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapSetting: {
      id: "map",
      scale: 14,
      showLocation: true,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      longitude: "113.324520",
      latitude: "23.099994",
      markers: []
    },
    fieldList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    //获取事件对象
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('content', (info) => {
      this.setData({
        mapSetting: {
          longitude: info.location.lon,
          latitude: info.location.lat,
          markers: [{
            longitude: info.location.lon,
            latitude: info.location.lat,
          }]
        },
        fieldList: info.fieldList
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