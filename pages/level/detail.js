// pages/level/detail.js
'use strict';

var WxParse = require('../../assets/wxParse/wxParse');
var config = require('../../config');
var utils = require('../../utils/util');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level: null,
    user: {
      level_id: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //用户状态
    if (app.globalData.userInfo) {
      that.setData({
        'user.level_id': getApp().globalData.userInfo.level_id
      });
    }

    var data = {
      id: options.id,
      act: 'detail'
    };

    //会员等级
    utils.request(config.service.level, data, 'GET', function (response) {
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
          level: response.data.level
        });

        for(var i = 0; i < response.data.level.privileges.length; i++) {
          WxParse.wxParse('level.privileges[' + i + '].richContent', 'html', response.data.level.privileges[i].content, that, 5);
        }

        wx.setNavigationBarTitle({
          title: level.name
        });
      }
    });
  }
});