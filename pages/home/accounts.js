// pages/home/accounts.js
const app = getApp();
var utils = require('../../utils/util');
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    desc: '',
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page_title = '资产明细';
    switch(options.mode) {
      case 'balance':
        page_title = '余额明细';
        break;

      case 'reward':
        page_title = '佣金明细';
        break;

      case 'reward_await':
        page_title = '待发佣金明细';
        break;

      case 'integral':
        page_title = '积分明细';
        break;

      case 'integral_await':
        page_title = '待发积分明细';
        break;
    }

    wx.setNavigationBarTitle({
      title: page_title,
    });

    var that = this;
    var data = {
      'act': options.mode,
      'token': getApp().globalData.token,
    }

    utils.request(config.service.account, data, 'GET', function (response) {
      that.setData(response.data.account);
    });
  }
});