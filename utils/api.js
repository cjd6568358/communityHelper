import http from './http.js'

let getGlobalData = () => {
  return getApp().globalData
}

let code2Session = (code) => {
  return http.get({
    url: `wechat/code2Session/${code}`
  })
}

let getGlobalConfig = () => {
  return new Promise((reslove, reject) => {
    http.get({
      url: 'https://cjd6568358.gitee.io/static/communityhelper/config.json'
    }).then(res => {
      wx.setStorageSync('globalConfig', res)
      reslove(res)
    }).catch(e => {
      let globalConfig = wx.getStorageSync('globalConfig')
      if (globalConfig) {
        console.log('globalConfig is cache')
        reslove(globalConfig)
      } else {
        console.warn('globalConfig初始化异常')
        reject(null)
      }
    })
  })
}

let getPageContent = (url, selector) => {
  return http.post({
    url: `html2Json`,
    data: {
      httpConfig: {
        url,
        method: "get"
      },
      selector
    }
  })
}

export {
  getGlobalData,
  code2Session,
  getGlobalConfig,
  getPageContent
}