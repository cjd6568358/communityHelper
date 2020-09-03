import { getGlobalConfig, code2Session, getPageContent } from './api.js';
import QQMapWX from '../libs/qqmap-wx-jssdk.min.js'
const QQMapSDK = new QQMapWX({
  key: 'VCTBZ-BJ33U-POPVX-BI4XI-VZHPS-72FE7'
});

const formatTime = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const getTotalDaysArr = (yyyy, MM, leftPad = false) => {
  return new Array(new Date(yyyy, MM, 0).getDate()).fill(0).map((item, index) => {
    ++index
    return leftPad ? '0' + index : index
  })
}

const calculatGUID = () => {
  let guid = '';
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
      guid += '-';
    }
  }
  return guid;
}

const sendMsg = (title, content) => {
  if (typeof content == "object") {
    content = JSON.stringify(content)
  }
  wx.request({
    method: 'POST',
    url: 'https://cjd6568358.3322.org:6706/api/sendMsg',
    dataType: 'json',
    responseType: 'text',
    data: {
      title, content
    }
  })
}

const showToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

const checkSDKVersion = (v2) => {
  let { SDKVersion } = wx.getSystemInfoSync()
  let v1 = SDKVersion.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

const getOpenId = () => {
  return new Promise((resolve, reject) => {
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      // 登录
      wx.login({
        success: res => {
          if (res.code) {
            // 发送 res.code 到后台换取 openid, sessionKey, unionId
            code2Session(res.code).then(({ statusCode, statusMsg, data }) => {
              if (statusCode == 1) {
                wx.setStorageSync('openid', data.openid)
                resolve(data.openid)
              } else {
                sendMsg('社区生活小助手', "code2Session error:" + statusMsg)
                reject(statusMsg)
              }
            })
          } else {
            sendMsg('社区生活小助手', "wx.login error:" + res.errMsg)
            reject(res.errMsg)
          }
        },
        fail: () => {
          sendMsg('社区生活小助手', "wx.login error:")
          reject("wx.login error:")
        }
      })
    } else {
      resolve(openid)
    }
  })
}

const getInitData = () => {
  return new Promise((resolve, reject) => {
    Promise.all([getOpenId(), getGlobalConfig()]).then(([openid, globalConfig]) => {
      if (statusCode == 1) {
        resolve({
          openid,
          globalConfig
        })
      }
      else {
        reject(statusMsg)
      }
    }).catch((reason) => {
      reject(reason)
    })
  })
}

const arrayBuffer2String = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/**
 * 获取当前所在小区名称
 */
const getCurrCommunityName = () => {
  QQMapSDK.reverseGeocoder({
    success: function (res) {
      console.log(res);
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      console.log(res);
    }
  })
}

const takeASTEngine = (item) => {
  switch (item.type) {
    case 'tel':
      if (Array.isArray(item.value)) {
        wx.navigateTo({
          url: '/pages/children/default?title=' + item.name,
          events: {
          },
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('content', item.value)
            wx.hideLoading({
              success: (res) => { },
            })
          }
        })
      } else {
        wx.makePhoneCall({
          phoneNumber: item.value,
        });
      }
      break;
    case 'miniprogram':
      wx.navigateToMiniProgram({
        appId: item.value,
      });
      break;
    case 'map':
      let url = '/pages/children/map?title=' + item.name
      if (Array.isArray(item.value)) {
        url = '/pages/children/default?title=' + item.name
      }
      wx.navigateTo({
        url,
        events: {
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('content', item.value || item)
          wx.hideLoading({
            success: (res) => { },
          })
        }
      })
      break;
    case 'ticket':
    case 'broadcast':
    case 'url':
      wx.showLoading({
        title: '加载中',
      });
      getPageContent(item.value, `.rich_media_content{html($)}`).then(({ data: content }) => {
        wx.navigateTo({
          url: '/pages/children/richText?title=' + item.name,
          events: {
          },
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('richTextContent', content)
            wx.hideLoading({
              success: (res) => { },
            })
          }
        })
      })
      break;
    default:

  }
}

export {
  formatTime,
  getTotalDaysArr,
  calculatGUID,
  sendMsg,
  showToast,
  checkSDKVersion,
  getOpenId,
  getInitData,
  arrayBuffer2String,
  takeASTEngine,
  QQMapSDK,
  getCurrCommunityName
}