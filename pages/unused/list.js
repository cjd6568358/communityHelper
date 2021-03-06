// pages/unused/list.js
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      list: (myApp.globalData.communityInfo['unused'] || []).filter(item => item.display !== 0)
    })
  },
  itemClick({ currentTarget: { dataset: { item } } }) {
    console.log(item)
    takeASTEngine(item)
  },
  bindPublish() {
    wx.navigateTo({
      url: '/pages/about/feedback',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('content', { title: `我有闲置物品要发布` })
        wx.hideLoading({
          success: (res) => { },
        })
      }
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
    return {
      path: `/pages/location/index?redirect=/${this.route}`
    }
  }
})