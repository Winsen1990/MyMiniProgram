// pages/feed/detail.js
var WxParse = require('../../assets/wxParse/wxParse');
var utils = require('../../utils/util');
const config = require('../../config');
const app = getApp();

Page({  

  /**
   * 页面的初始数据
   */
  data: {
    feed: {},
    login: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      login: utils.checkAuthorization()
    });

    var data = {
      id: options.id || 0,
      token: app.globalData.token,
      act: 'show'
    };

    utils.request(config.service.feed, data, 'GET', function(response) {
      if(response.data.error != 0) {
        wx.showModal({
          conten: '参数错误',
          showCancel: false,
          success: function() {
            wx.navigateBack();
          }
        });
      } else {
        that.setData({
          feed: response.data.feed
        });

        that.updateViewCount();

        //种草内容详情
        WxParse.wxParse('feed.richContent', 'html', that.data.feed.content, that, 5);
        //评论回复内容
        if (that.data.feed.comments.length) {
          for (var i = 0; i < that.data.feed.comments.length; i++) {
            var comment = that.data.feed.comments[i];
            comment.comment = utils.emojiToImage(comment.comment);
            WxParse.wxParse('feed.comments[' + i + '].richComment', 'html', comment.comment, that, 5);

            if (comment.has_reply) {
              comment.reply.content = utils.emojiToImage(comment.reply.content);
              WxParse.wxParse('feed.comments[' + i + '].reply.richReply', 'html', comment.reply.content, that, 5);
            }
          }
        }
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
  
  },

  /**
   * 更新资讯阅读量
   */
  updateViewCount: function() {
    var that = this;
    var read = wx.getStorageSync('feed-' + this.data.feed.id);

    if(read) {
      return false;
    }

    utils.request(config.service.feed, { opera: 'update_view_count', id: this.data.feed.id }, 'POST', function(response) {
      if(response.data.error == 0) {
        wx.setStorageSync('feed-' + that.data.feed.id, true);
      }
    }, null, false);
  },

  /**
   * 资讯点赞
   */
  thumbUp: function() {
    var that = this;

    var data = {
      id: this.data.feed.id,
      opera: 'thumb_up',
      token: app.globalData.token
    };

    utils.request(config.service.feed, data, 'POST', function(response) {
      if(response.data.error == 0) {
        var params = {};
        params['feed.self_thumb_up'] = that.data.feed.self_thumb_up ^ true;
        if(that.data.feed.self_thumb_up) {
          params['feed.thumb_up'] = that.data.feed.thumb_up - 1;
        } else {
          params['feed.thumb_up'] = that.data.feed.thumb_up + 1;
        }

        that.setData(params);
      }
    });
  },

  /**
   * 评论点赞
   */
  commentThumbUp: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var mode = e.currentTarget.dataset.type;

    if(id <= 0) {
      return false;
    }

    var data = {
      opera: 'thumb_up',
      id: id,
      token: app.globalData.token
    };

    utils.request(config.service.content_comment, data, 'POST', function(response) {
      if(response.data.error == 0) {
        var params = {};

        if(mode == 'comment') {
          params['feed.comments[' + index + '].self_thumb_up'] = that.data.feed.comments[index].self_thumb_up ^ true;
          if (that.data.feed.comments[index].self_thumb_up) {
            params['feed.comments[' + index + '].thumb_up'] = that.data.feed.comments[index].self_thumb_up - 1;
          } else {
            params['feed.comments[' + index + '].thumb_up'] = that.data.feed.comments[index].self_thumb_up + 1;
          }
        } else {
          params['feed.comments[' + index + '].reply.self_thumb_up'] = that.data.feed.comments[index].reply.self_thumb_up ^ true;

          if (that.data.feed.comments[index].reply.self_thumb_up) {
            params['feed.comments[' + index + '].reply.thumb_up'] = that.data.feed.comments[index].reply.thumb_up - 1;
          } else {
            params['feed.comments[' + index + '].reply.thumb_up'] = that.data.feed.comments[index].reply.thumb_up + 1;
          }
        }
        that.setData(params);
      }
    }, null, false);
  }
});