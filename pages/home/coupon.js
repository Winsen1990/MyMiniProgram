// pages/home/coupon.js
const app = getApp();
var utils = require('../../utils/util');
var config = require('../../config');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = {
      act: 'self',
      token: app.globalData.token
    };

    utils.request(config.service.coupon, data, 'GET', function (response) {
      console.log(response.data.coupons);
      that.setData({
        coupons: response.data.coupons,
      });
    });
  }
});