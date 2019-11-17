// pages/product/index.js
'use strict';

var config = require('../../config');
var utils = require('../../utils/util');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    keyword: '',
    total_page: 1,
    page: 0,
    page_size: 10,
    order: 'star',
    sort: 'DESC',
    category_id: 0,
    focus: false,
    display: 'grid',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      category_id: options.category_id || 0,
      keyword: options.keyword || ''
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
    var that = this;

    wx.startPullDownRefresh();
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
    if (this.data.loading) {
      wx.stopPullDownRefresh();
      return false;
    }

    this.data.loading = true;
    this.data.page = 1;

    var that = this;

    var data = {
      page: this.data.page,
      keyword: this.data.keyword,
      page_size: this.data.page_size,
      category_id: this.data.category_id,
      order: this.data.order,
      sort: this.data.sort,
      act: 'view'
    };

    utils.request(config.service.product, data, 'GET', function (response) {
      console.info(response);

      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function () {
          wx.hideToast();
        }, 3000);

        that.setData({
          products: [],
          total_page: 1,
          page: 1,
          loading: false
        });
      } else {
        that.setData({
          products: response.data.products,
          total_page: response.data.total_page,
          page: response.data.page,
          loading: false
        });
      }

      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page >= this.data.total_page || this.data.loading) {
      return false;
    }

    this.data.loading = true;

    var that = this;

    var data = {
      page: (this.data.page + 1),
      keyword: this.data.keyword,
      page_size: this.data.page_size,
      category_id: this.data.category_id,
      order: this.data.order,
      sort: this.data.sort,
      act: 'view'
    };

    utils.request(config.service.product, data, 'GET', function (response) {
      console.info(response);

      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function () {
          wx.hideToast();
        }, 3000);

        that.setData({
          loading: false
        });
      } else {
        var products = that.data.products;
        for (var i = 0; i < response.data.products.length; i++) {
          products.push(response.data.products[i]);
        }
        that.setData({
          products: products,
          total_page: response.data.total_page,
          page: response.data.page,
          loading: false
        });
      }
    });
  },

  /**
   * 切换筛选条件
   */
  tapFilter: function (e) {
    console.info(e);
    var order = e.currentTarget.dataset.order;

    if (order == 'price') {
      this.setData({
        order: order,
        sort: this.data.sort == 'ASC' ? 'DESC' : 'ASC'
      });
    } else {
      if (order == this.data.order) {
        return false;
      }

      this.setData({
        order: order
      });

    }

    wx.startPullDownRefresh();
  },

  /**
   * 搜索产品
   */
  search: function (e) {
    var keyword = e.detail.value;

    keyword = keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');

    if (keyword != '') {
      this.setData({
        keyword: keyword
      });

      wx.startPullDownRefresh();
    }
  },

  /**
   * 切换显示样式
   */
  switchDisplay: function () {
    this.setData({
      display: this.data.display == 'grid' ? 'list' : 'grid'
    });
  },

  /**
   * 产品添加到购物车
   */
  addToCart: function (e) {
    var data = {
      opera: 'add',
      product_id: e.currentTarget.dataset.id,
      count: 1,
      token: app.globalData.token
    };

    utils.request(config.service.cart, data, 'POST', function (response) {
      wx.showToast({
        title: response.data.message,
        icon: response.data.error != 0 ? 'none' : 'success',
        duration: 3000
      });
    });
  }
});