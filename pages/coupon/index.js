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

  gain: function(e)
  {
    var that = this;
    var data = {
      id: e.currentTarget.dataset.id || 0,
      opera: 'gain',
      token: app.globalData.token
    };

    utils.request(config.service.coupon, data, 'POST', function (response) {
      if(response.data.error == 0) {
        wx.showModal({
          title: '',
          content: response.data.message,
          showCancel: false,
          success: function() {
            that.onShow();
          }
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: response.data.message,
          duration: 3000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = {
      act: 'view',
      token: app.globalData.token
    };

    utils.request(config.service.coupon, data, 'GET', function (response) {
      that.setData({
        coupons: response.data.coupons,
      });
    });
  }
});