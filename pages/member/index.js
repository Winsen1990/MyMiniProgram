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
    id: 1,
    order: 'star',
    sort: 'DESC',
    display: 'list',
    loading: false,
    block: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    var data = {
      id: this.data.id,
      order: this.data.order,
      sort: this.data.sort,
      act: 'view',
      token: getApp().globalData.token,
    };

    utils.request(config.service.block, data, 'GET', function (response) {
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
          loading: false
        });
      } else {
        that.setData({
          products: response.data.products,
          block: response.data.block,
          loading: false
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    wx.startPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.loading) {
      wx.stopPullDownRefresh();
      return false;
    }

    this.data.loading = true;
    this.data.page = 1;

    var that = this;

    var data = {
      id: this.data.id,
      order: this.data.order,
      sort: this.data.sort,
      act: 'view'
    };

    utils.request(config.service.block, data, 'GET', function(response) {
      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function() {
          wx.hideToast();
        }, 3000);

        that.setData({
          products: [],
          loading: false
        });
      } else {
        that.setData({
          products: response.data.products,
          block: response.data.block,
          loading: false
        });
      }

      wx.stopPullDownRefresh();
    });
  },

  /**
   * 切换筛选条件
   */
  tapFilter: function(e) {
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
   * 切换显示样式
   */
  switchDisplay: function() {
    this.setData({
      display: this.data.display == 'grid' ? 'list' : 'grid'
    });
  },

  /**
   * 产品添加到购物车
   */
  addToCart: function(e) {
    var data = {
      opera: 'add',
      product_id: e.currentTarget.dataset.id,
      count: 1,
      token: app.globalData.token
    };

    utils.request(config.service.cart, data, 'POST', function(response) {
      if (response.data.error == 0) {
        wx.showModal({
          content: '加入购物车成功',
          showCancel: true,
          cancelText: '继续逛逛',
          confirmText: '立即结算',
          success: (e) => {
            if (e.confirm) {
              wx.switchTab({
                url: '/pages/cart/index',
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: response.data.message,
          icon: 'none',
          duration: 3000
        });
      }
    });
  }
});