// pages/address/index.js
var config = require('../../config')
var util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feeds: [],
    page: 1,
    size: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onPullDownRefresh();
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
    var that = this;

    util.request(config.service.feed, { page: this.data.page, act: 'view' }, 'GET', function (response) {
      if (response.data.error == 0) {
        if(response.data.feeds.length >= that.data.size) {
          that.data.page++;
        }

        for(var i = 0; i < response.data.feeds.length; i++) {
          var in_place = false;
          for(var j = 0; j < that.data.feeds.length; j++) {
            if(that.data.feeds[j].id == response.data.feeds[i].id) {
              in_place = true;
              break;
            }
          }

          if(!in_place) {
            that.data.feeds.push(response.data.feeds[i]);
          }
        }

        that.setData({
          feeds: that.data.feeds
        });
      }
    });

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