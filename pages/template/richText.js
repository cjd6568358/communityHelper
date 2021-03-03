// pages/tools/richText.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: '',
    feedback: 0,
    status: 0,
    mailTo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.extraData) {
      let extraData = JSON.parse(options.extraData)
      if (extraData.title) {
        wx.setNavigationBarTitle({
          title: extraData.title,
        })
        this.setData(extraData)
      }
    } else {
      //获取事件对象
      const eventChannel = this.getOpenerEventChannel()
      // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('richTextContent', ({ title = "", content, mailTo = "", feedback = 0, status = 0 }) => {
        this.setData({
          title,
          content,
          feedback,
          mailTo,
          status
        })
      })
    }
  },
  bindPublish() {
    let { mailTo, title, feedback } = this.data
    wx.navigateTo({
      url: '/pages/about/feedback',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('content', { titleDisabled: 1, contentPlaceholder: "这里是录音示例:我是XX小区15号201梁某某,对于XX改造,我的看法是同意/反对,理由是...", title, mailTo, type: feedback ? 'ticket' : "" })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    return {
      title: this.data.title,
      path: `/${this.route}?extraData=${JSON.stringify(this.data)}`
    }
  }
})