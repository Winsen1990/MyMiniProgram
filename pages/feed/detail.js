// pages/feed/detail.js
var config = require('../../config')
var util = require('../../utils/util')
var WxParse = require('../../wxParse/wxParse');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed: {},
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.id = options.id || 0;

    util.request(config.service.feed, { act: 'show', id: this.data.id }, 'GET', function(response) {
      that.setData({
        feed: response.data.feed
      });
      
      //加载产品详情富文本
      WxParse.wxParse('wap_content', 'html', that.data.feed.wap_content, that, 5);
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
    wx.stopPullDownRefresh();
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