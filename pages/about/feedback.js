// pages/about/feedback.js
import { sendMsg, showToast } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取事件对象
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('content', ({ title = "", content = "" }) => {
      this.setData({
        title,
        content
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindSubmit() {
    let { title, content } = this.data
    if (!title) {
      showToast('标题不能为空')
      return
    }
    if (!content) {
      showToast('内容不能为空')
      return
    }
    sendMsg(title, content, "sms")
    showToast('提交成功,管理员将尽快审核补全')
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  },
  bindInputChange({ currentTarget: { dataset: { key } }, detail: { value } }) {
    this.setData({
      [key]: value
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