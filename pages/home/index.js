//index.js
//获取应用实例
var utils = require('../../utils/util');
var config = require('../../config');
const app = getApp();

Page({
  data: {
    userInfo: {
      avatar: '../../assets/images/user-unlogin.png',
      nickname: '获取微信信息',
      level_id: 1,
      account: '',
      balance: 0,
      integral: 0,
      level_active_time: '',
      level_expired: '',
      level_name: '普通会员',
      mobile: null
    },
    min_grant_price: 999,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        'userInfo.avatar': app.globalData.userInfo.avatar,
        'userInfo.nickname': app.globalData.userInfo.nickname,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          'userInfo.avatar': res.userInfo.avatarUrl,
          'userInfo.nickname': res.userInfo.nickName,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            'userInfo.avatar': res.userInfo.avatarUrl,
            'userInfo.nickname': res.userInfo.nickName,
            hasUserInfo: true
          });

          utils.syncUserInfo(res);
        }
      });
    }
  },
  onShow: function() {
    var that = this;
    var data = {
      act: 'show',
      token: getApp().globalData.token,
    };

    utils.request(config.service.member, data, 'GET', function (response) {
      if(response.data.error == 0) {
        that.setData({
          userInfo: response.data.member,
          banners: response.data.banners,
          min_grant_price: response.data.min_grant_price,
          hasUserInfo: true
        });
      }
    });
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var that = this;
    utils.syncUserInfo(e.detail, function () {
      that.onLoad();
    });
  },
});
