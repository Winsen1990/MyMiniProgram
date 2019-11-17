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
      level_id: 1
    },
    wine_stock: [
      {
        id: 1,
        name: "西拉子马克贝尔",
        img: "../../assets/images/wine-1.png",
        quantity: 1,
        grow: false
      },
      {
        id: 2,
        name: "成长红酒",
        img: "../../assets/images/wine-2.png",
        quantity: 0.6,
        grow: true
      }
    ],
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
