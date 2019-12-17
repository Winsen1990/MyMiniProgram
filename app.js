//app.js
var config = require('config');
var utils = require('utils/util');

App({
  onLaunch: function (e) {
    console.info(e);
    // 展示本地存储能力
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        /*
        utils.request(config.service.login, { code: res.code, recommend: e.query.recommend }, 'POST', function(response) {
          console.log(response);
          console.log('login success ' + response.data.user.account);
          if (response.data.error == 0) {
            that.globalData.account = response.data.user.account;
            if (response.data.user.nickname) {
              that.globalData.userInfo = response.data.user;
            }
            that.globalData.token = response.data.token;
            that.globalData.expired = response.data.expired;
          }

          that.getUserInfo();
        });
        */
      }
    });
  },
  getUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        console.info(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.info(res);
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = {
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl
              };

              utils.syncUserInfo(res);
              /*
              var data = { res: res, nickname: res.userInfo.nickName, avatar: res.userInfo.avatarUrl, opera: 'sync', account: that.globalData.account, token: that.globalData.token };

              utils.request(config.service.member, data, 'POST', function(response) {
                console.info(response);
              });
              */

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  globalData: {
    account: null,
    userInfo: null,
    token: null,
    expired: 0,
    logining: false
  }
});

















