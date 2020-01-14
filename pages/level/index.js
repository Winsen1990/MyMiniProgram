// pages/level/index.js
'use strict';

var config = require('../../config');
var utils = require('../../utils/util');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    block: null,
    block_id: 1,
    levels: [],
    products: [],
    user: {
      level_id: 1
    }
  },

  onLoad: function() {
    wx.hideTabBar();
  },

  onShow: function (options) {
    var that = this;

    //用户状态
    if(app.globalData.userInfo) {
      that.setData({
        'user.level_id': getApp().globalData.userInfo.level_id
      });
    }

    //会员等级
    utils.request(config.service.level, { token: getApp().globalData.token, act: 'list' }, 'GET', function(response) {
      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function () {
          wx.hideToast();
        }, 3000);
      } else {
        that.setData({
          levels: response.data.levels
        });
      }
    });

    //专区产品
    var data = {
      id: this.data.block_id,
      token: getApp().globalData.token,
    };

    utils.request(config.service.block, data, 'GET', function (response) {
      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function () {
          wx.hideToast();
        }, 3000);
      } else {
        that.setData({
          block: response.data.block,
          products: response.data.products
        });
      }
    });
  }
});