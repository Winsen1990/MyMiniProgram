// pages/inventory/index.js
const app = getApp();
const utils = require('../../utils/util');
const config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inventories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    var data = {
      act: 'view',
      token: getApp().globalData.token,
    };
    utils.request(config.service.inventory, data, 'GET', function (response) {
      that.setData({
        inventories: response.data.inventories
      })
    });
  }
});