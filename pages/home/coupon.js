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
    var that = this;
    var data = {
      id: options.id || 0,
      act: 'show',
      token: app.globalData.token
    };
    
    utils.request(config.service.coupon, data, 'GET', function (response) {
      console.log(response.data.coupons);
      that.setData({
        'coupons': response.data.coupons,
      });
    });
  },

  gainCoupon: function(e)
  {
    var data = {
      id: e.currentTarget.dataset.id || 0,
      opera: 'gain',
      token: app.globalData.token
    };

    utils.request(config.service.coupon, data, 'POST', function (response) {
      wx.showToast({
        title: response.data.message,
        duration: 2000,
      });

      if(response.data.error == 1) {
        wx.switchTab({
          url: '/pages/index/index',
        });
      }
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