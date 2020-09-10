// pages/location/index.js
import { getGlobalConfig } from '../../utils/api'
import { showToast, sendMsg } from '../../utils/util'
const myApp = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.redirect = options.redirect
    this.from = options.from
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let currCommunity = wx.getStorageSync('currCommunity')
    getGlobalConfig().then(config => {
      if (config && currCommunity && config[currCommunity]) {
        myApp.globalData.communityInfo = config[currCommunity]
        if (!this.from) {
          wx.switchTab({
            url: this.redirect || '/pages/information/index',
          })
        } else {
          this.setData({
            communityList: Object.keys(config),
            globalConfig: config
          })
        }
      } else if (config) {
        this.setData({
          communityList: Object.keys(config),
          globalConfig: config
        })
      }
      wx.hideLoading({
        success: (res) => { },
      })
    }).catch(e => {
      wx.hideLoading({
        success: (res) => { },
      })
      showToast('globalConfig初始化异常')
      sendMsg('globalConfig初始化异常', JSON.stringify(e))
    })
  },
  itemClick({ currentTarget: { dataset: { item } } }) {
    wx.setStorageSync('currCommunity', item)
    myApp.globalData.communityInfo = this.data.globalConfig[item]
    wx.switchTab({
      url: this.redirect || '/pages/information/index',
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