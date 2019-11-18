// pages/home/index2.js

const app = getApp();
var utils = require('../../utils/util');
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatar: '/assets/images/avatar.png',
      nickname: '点击微信授权登录',
      level_id: 1
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    paths: {
      0: '/pages/order/index?status=1',
      1: '/pages/order/index?status=6',
      2: '/pages/order/index?status=7',
      3: '/pages/order/index?status=8',
      4: '/pages/home/reward', 
      5: '/pages/home/integral',
      6: '/pages/home/wallet',
      7: '/pages/home/coupon',
      8: '/pages/home/member',
      9: '/pages/index/index',
      10: '/pages/address/index',
    },
    banner: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
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

    utils.request(config.service.mine, {}, 'GET', function (response) {
      that.setData({
        'banner': response.data.banner,
      });
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

  // 跳转
  goTo: function(e) {
    var idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: this.data.paths[idx],
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})