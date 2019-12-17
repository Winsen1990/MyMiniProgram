// pages/feed/comment.js
var WxParse = require('../../assets/wxParse/wxParse');
var utils = require('../../utils/util');
const config = require('../../config');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed: {
      id: 1,
      title: '满堂花醉三千客，一剑霜寒十四州'
    },
    emojis: [],
    comment: '',
    showEmoji: false,
    can_submit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      'feed.id': options.id || 0,
      'feed.title': options.title || ''
    });

    var render_emojis = [];
    var page = -1;
    for(var i = 0; i < utils.emojis.length; i++) {
      if(i%24 === 0) {
        page++;
      }

      if(!render_emojis[page]) {
        render_emojis[page] = [];
      }

      render_emojis[page].push(utils.emojis[i]);
    }

    that.setData({
      emojis: render_emojis
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

  /*
   * 提交留言
   */
  submitComment: function () {
    var that = this;

    var data = {
      id: this.data.feed.id,
      comment: this.data.comment,
      token: app.globalData.token,
      opera: 'add'
    };

    utils.request(config.service.content_comment, data, 'POST', function(response) {
      wx.showModal({
        content: response.data.message,
        showCancel: false,
        success: function() {
          if(response.data.error == 0) {
            wx.navigateBack();
          }
        }
      });
    }, null, true, '正在提交评论');
  },

  /*
   *
   */
  toggleEmoji: function () {
    this.setData({
      showEmoji: this.data.showEmoji ^ true
    });
  },

  /*
   * 监听输入
   */
  watchTextArea: function(e) {
    this.setData({
      comment: e.detail.value ? e.detail.value : '',
      can_submit: e.detail.value.length > 0
    });
  },

  /*
   * 输入表情
   */
  selectEmoji: function (e) {
    var content = this.data.comment;
    content += '[' + e.currentTarget.dataset.name + ']';
    this.setData({
      comment: content,
      can_submit: content.length > 0
    });
  }
});