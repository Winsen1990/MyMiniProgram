const app = getApp();
var utils = require('../../utils/util');
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    reward: 0,
    reward_await: 0,
    integral: 0,
    integral_await: 0,
    coupon_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = {
      'act': 'wallet',
      'token': getApp().globalData.token,
    }
    utils.request(config.service.account, data, 'GET', function (response) {
      that.setData(response.data.wallet);
    });
  }
});