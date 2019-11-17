// pages/feed/index.js
const app = getApp();
const config = require('../../config');
const utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feeds: [],
    renderList: [],
    bottom: 0,
    screen: {
      width: 0,
      height: 0,
      pixelRatio: 1
    },
    page: 1,
    page_size: 2,
    to_end: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕宽高  
    wx.getSystemInfo({
      success: (res) => {
        var window_width = res.windowWidth;
        var window_height = res.windowHeight;

        that.setData({
          screen: {
            width: window_width,
            height: window_height,
            pixelRatio: res.pixelRatio
          }
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
    this.loadFeeds(1, this.data.page_size);
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
    // console.info('pull down refresh');
    // wx.stopPullDownRefresh();
    // wx.showNavigationBarLoading();

    // setTimeout(function() {
    //   wx.hideNavigationBarLoading();
    // }, 10000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  //重新组织渲染列表
  rebuildRenderList: function() {
    if(this.data.feeds.length === 0) {
      return false;
    }

    var prev_day_diff = 1;

    var today = new Date();

    var render_list = [];
    for(var i = 0; i < this.data.feeds.length; i++) {
      var feed = this.data.feeds[i];
      feed.mode = 'article';
      var publish_date = new Date(feed.publish_time);
      var day_diff = parseInt((today - publish_date)/1000/3600/24);

      if(day_diff != prev_day_diff) {
        prev_day_diff = day_diff;

        if(today.getFullYear() != publish_date.getFullYear()) {
          render_list.splice(0, 0, {
            mode: 'date',
            date: publish_date.getFullYear() + '年' + (publish_date.getMonth() + 1) + '月' + publish_date.getDate() + '日'
          });
        } else if(today.getMonth() != publish_date.getMonth()) {
          render_list.splice(0, 0, {
            mode: 'date',
            date: (publish_date.getMonth() + 1) + '月' + publish_date.getDate() + '日'
          });
        } else {
          if(day_diff == 0) {
            render_list.splice(0, 0, {
              mode: 'date',
              date: '今天'
            });
          } else if(day_diff == -1) {
            render_list.splice(0, 0, {
              mode: 'date',
              date: '昨天'
            });
          } else {
            render_list.splice(0, 0, {
              mode: 'date',
              date: (publish_date.getMonth() + 1) + '月' + publish_date.getDate() + '日'
            });
          }
        }
      }

      render_list.splice(1, 0, feed);
    }

    this.setData({
      renderList: render_list
    });

    if(render_list.length && this.data.page == 1) {
      setTimeout(this.scrollToBottom, 800);
    }
  },

  scrollToBottom: function() {
    var that = this;
    const query = wx.createSelectorQuery().in(this);
    query.selectAll('.feed').boundingClientRect(function(rects) {
      console.info(rects[rects.length - 1].bottom);
      that.setData({
        bottom: rects[rects.length - 1].bottom
      });
    }).exec();
  },

  scrollToTop: function() {
    console.info('to top');
    if(this.data.to_end) {
      return false;
    }

    this.loadFeeds((this.data.page + 1), this.data.page_size);
  },

  /**
   * 加载种草列表
   */
  loadFeeds: function(page, page_size) {
    if(this.data.loading) {
      return false;
    }

    wx.showNavigationBarLoading();

    var that = this;
    this.setData({
      loading: true
    });

    var data = {
      act: 'view',
      page: page,
      page_size: page_size
    };

    utils.request(config.service.feed, data, 'GET', function (response) {
      wx.hideNavigationBarLoading();

      if (response.data.error == 0) {
        that.setData({
          to_end: response.data.feeds.length < that.data.page_size,
          feeds: response.data.feeds,
          page: data.page
        });
        //重新组织待渲染的数据
        that.rebuildRenderList();
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      }

      that.setData({
        loading: false
      });
    }, null, false);
  }
});