//app.js
var config = require('./config');
var util = require('./utils/util');

App({
    onLaunch: function () {
      var that = this;
      // 登录
      if (!this.globalData.token) {
        this.globalData.logining = true;

        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.errMsg == 'login:ok') {
              console.info(res);
              wx.request({
                url: config.service.login,
                data: { code: res.code },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (response) {
                  console.info(response);
                  if (response.data.error == 0) {
                    that.globalData.userInfo = response.data.user;
                    that.globalData.token = response.data.token;
                    that.globalData.expired = response.data.expired;
                  }
                }
              });
            }
          },
          complete: () => {
            that.globalData.logining = false;
          }
        });
      }
      /*
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
      */
    },
    globalData: {
      userInfo: null,
      token: null,
      expired: 0,
      logining: false
    }
});