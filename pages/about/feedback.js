// pages/about/feedback.js
import { sendMsg, showToast, baseUrl } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    mailTo: "",
    type: '',
    agree: "1",
    floor: "",
    voice: {},
    voiceTime: 0,
    contentPlaceholder: "请输入内容",
    titleDisabled: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.voiceReciver = wx.getRecorderManager();
    this.voicePlayer = wx.createInnerAudioContext()

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
      eventChannel.on && eventChannel.on('content', ({ titleDisabled = 0, contentPlaceholder = "请输入内容", title = "", content = "", mailTo = "", type = "" }) => {
        this.setData({
          title,
          content,
          mailTo,
          type,
          contentPlaceholder,
          titleDisabled
        })
      })
    }
  },
  radioChange(e) {
    this.setData({
      agree: +e.detail.value
    })
  },
  touchStart() {
    console.log('开始');
    this.setData({
      voice: {}
    })
    let option = {
      duration: 10000, //录音的时长，之前最大值好像只有1分钟，现在最长可以录音10分钟
      format: 'mp3', //录音的格式，有aac和mp3两种   
    }
    this.voiceReciver.start(option); //开始录音   这么写的话，之后录音得到的数据，就是你上面写得数据。
    this.voiceReciver.onStart(() => {
      console.log('录音开始事件') //这个方法是录音开始事件，你可以写录音开始的时候图片或者页面的变化
    })
  },
  touchEnd() {
    console.log('结束')
    this.voiceReciver.stop();
    this.voiceReciver.onStop((res) => {
      console.log(res) //这里是必须写完成事件的，因为最后的文件，就在这里面；
      this.setData({
        voice: res,
        voiceTime: parseInt(res.duration / 1000),
      })
      // 其中：
      // res.tempFilePath;//是临时的文件地址
      // res.duration;//录音的时长
      // res.fileSize;//文件的大小
    })
  },
  playVoice() {
    let voice = this.data.voice.tempFilePath;
    this.voicePlayer.src = voice;
    this.voicePlayer.play()
    this.voicePlayer.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindSubmit() {
    let { title, content, type, agree, floor, voice, mailTo = "17712522763@189.cn" } = this.data
    if (!title) {
      showToast('标题不能为空')
      return
    }
    if (!content) {
      showToast('内容不能为空')
      return
    }
    if (type === "ticket") {
      if (!floor || (!floor.includes('#') && !floor.includes('号'))) {
        showToast('请输入有效的楼层号,无效填写视为放弃投票')
        return
      }
      if (!voice.tempFilePath) {
        showToast('录音不能为空')
        return
      }
      wx.uploadFile({
        filePath: voice.tempFilePath,
        name: 'voice',
        formData: {
          fileKeys: 'voice',
          mailTo,
          mailTitle: `${title}[${floor}][${+agree ? '同意' : '反对'}]`,
          mailText: content
        },
        url: `${baseUrl}upload`,
      })
      showToast('提交成功')
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/ticket/list',
        })
      }, 3000)
    } else {
      sendMsg(title, content, "sms")
      showToast('提交成功,管理员将尽快审核补全')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
    }
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
    return {
      path: `/${this.route}?extraData=${JSON.stringify(this.data)}`
    }
  }
})