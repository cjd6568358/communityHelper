import { sendMsg, baseUrl } from './util.js'
let request = {};
let methods = ['get', 'post', 'put', 'delete'];
methods.forEach((method) => {
  request[method] = (config) => {
    return new Promise((resolve, reject) => {
      let { data: postData = {}, url, ...others } = config;
      let isAbsoluteUrl = url.indexOf("//") >= 0;
      url = isAbsoluteUrl ? url : `${baseUrl}${url}`;
      let defaultConfig = {
        url,
        data: '',
        method,
        ...others,
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          let { data: resData, statusCode, header } = res;
          if (resData.statusCode <= 0) {
            sendMsg && sendMsg('社区生活小助手success:debug', { defaultConfig, resData })
          }
          resolve(resData)
        },
        fail: (res) => {
          reject(res)
        }
      }
      if (method == 'get' && !isAbsoluteUrl) {
        defaultConfig.url = `${defaultConfig.url}?`;
        defaultConfig.url += Object.keys(postData).filter(key => postData[key]).map((key, index) => {
          return `${key}=${postData[key]}`
        }).join('&')
      } else if (!isAbsoluteUrl) {
        defaultConfig.data = postData
      }
      wx.request(defaultConfig)
    })
  }
})

export default request