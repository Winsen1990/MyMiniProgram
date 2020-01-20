// pages/product/comment.js
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
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = {
      id: options.id,
      token: app.globalData.token,
      act: 'comments'
    };

    utils.request(config.service.product, data, 'GET', function (response) {
      if (response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false,
          success: function () {
            wx.navigateBack();
          }
        });
      } else {
        that.setData({
          comments: response.data.comments
        });

        if(response.data.comments.length) {
          for(var i = 0; i < response.data.comments.length; i++) {
            var comment = response.data.comments[i];

            //评价
            WxParse.wxParse('comments[' + i + '].commentRich', 'html', comment.comment, that, 5);

            if(comment.reply) {
              //评价回复
              WxParse.wxParse('comments[' + i + '].reply.commentRich', 'html', comment.reply.comment, that, 5);
            }
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
});