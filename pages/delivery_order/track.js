// pages/delivery_order/track.js
var config = require('../../config');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    track: {},
    order_sn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.order_sn = options.sn || '';

    var data = {
      sn: this.data.order_sn,
      act: 'express_info',
      token: getApp().globalData.token
    };

    util.request(config.service.order, data, 'GET', function (response) {
      if (response.data.error == 0) {
        that.setData({
          order: response.data.order,
          track: response.data.express
        });
      }
    });
  }
});