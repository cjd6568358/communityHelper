// pages/tools/children.js
import { takeASTEngine } from '../../utils/util'
const myApp = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currCommunity: wx.getStorageSync('currCommunity'),
    list: []
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
    eventChannel.on('content', (content) => {
      this.setData({
        list: content
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  itemClick({ currentTarget: { dataset: { item } } }) {
    console.log(item)
    takeASTEngine(item)
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