import http from './http.js'
import { sendMsg, showToast } from './util.js'

const url = `communityHelper`

let getGlobalData = () => {
  return getApp().globalData
}

let code2Session = (code) => {
  return http.get({
    url: `wechat/code2Session/${code}`
  })
}

let getGlobalConfig = () => {
  return http.post({
    url,
    data: {
      action: 'globalConfig'
    }
  })
}

exports = module.exports = {
  getGlobalData,
  code2Session,
  getGlobalConfig
}