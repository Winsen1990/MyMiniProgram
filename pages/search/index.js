// pages/search/index.js
const app = getApp();
const config = require('../../config');
const utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: [],
    keyword: '',
    search_history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    utils.request(config.service.keywords, { act: 'view' }, 'GET', function(response) {
      that.setData({
        keywords: response.data.keywords
      });
    }, null, false);

    var search_history = wx.getStorageSync('search_history');

    if(search_history) {
      console.info(search_history);
      this.setData({
        search_history: search_history
      });
    }
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
   * 点击关键词
   */
  keywordTap: function(e) {
    var that = this;
    this.setData({
      keyword: e.currentTarget.dataset.keyword
    });

    var data = {
      id: e.currentTarget.dataset.id,
      opera: 'click',
      token: app.globalData.token
    };

    utils.request(config.service.keywords, data, 'POST', function(response) {
      that.keywordSearch();
    }, null, true, '正在发起搜索');
  },

  /**
   * 提交关键词
   */
  keywordInput: function(e) {
    if(e.detail.value.length) {
      this.setData({
        keyword: e.detail.value
      });

      this.keywordSearch();
    } else {
      wx.showToast({
        title: '请输入关键词',
        duration: 3000
      });
    }
  },

  /**
   * 发起搜索
   */
  keywordSearch: function() {
    if(!this.data.keyword) {
      return false;
    }

    var search_history = this.data.search_history;
    if(search_history.indexOf(this.data.keyword) === -1) {
      if(search_history.length >= 10) {
        search_history.shift();
      }
      search_history.push(this.data.keyword);
      wx.setStorageSync('search_history', search_history);
    }

    wx.navigateTo({
      url: '/pages/product/index?keyword=' + this.data.keyword
    });
  }
});