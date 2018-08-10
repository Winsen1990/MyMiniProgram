const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var getTimestamp = () => {
  return new Date().getTime();
}

// 发起请求
var request = (url, data, method, success, fail, loading_text) => {
  loading_text = loading_text || '';

  wx.showLoading({
    title: loading_text,
    mask: true
  });

  var header = {};

  if(method == 'GET') {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
  }

  wx.request({
    url: url,
    data: data,
    method: method,
    success: success,
    header: header,
    fail: fail,
    complete: function() {
      wx.hideLoading();
    }
  });
}

// 登录检查
var checkAuthorization = () => {
  var token = getApp().globalData.token;
  var expired = getApp().globalData.expired;

  if(!token) {
    return false;
  }

  if(expired < getTimestamp()) {
    return false;
  }

  var user_info = getApp().globalData.userInfo;
  if(!user_info) {
    return false;
  }

  return true;
}

//登录
var login = (callback) => {
  if (getApp().globalData.logining) {
    return false;
  }
  getApp().globalData.logining = true;

  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.errMsg == 'login:ok') {
        console.info(res);
        getToken(res.code, callback);
      }
    },
    complete: () => {
      getApp().globalData.logining = false;
    }
  });
}

var config = require('../config.js');

function getToken(code, callback) {
  wx.request({
    url: config.service.login,
    data: { code: code },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(response) {
      console.info(response);
      if(response.data.error == 0) {
        getApp().globalData.userInfo = response.data.user;
        getApp().globalData.token = response.data.token;
        getApp().globalData.expired = response.data.expired;
        if (typeof (callback) == 'function') {
          callback.apply(this);
        }
      } else {
        wx.showModal({
          title: '提示',
          content: response.data.message,
        });
      }
    }
  });
}

module.exports = { checkAuthorization, formatTime, showBusy, showSuccess, showModel, login, request }