// pages/order/index.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    page: 1,
    page_size: 10,
    to_end: false,
    loading: false,
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status || 0
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadOrderList(this.data.status, 1, this.data.page_size);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadOrderList(this.data.status, 1, this.data.page_size, function() {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.to_end) {
      /*
      wx.showToast({
        title: '没有更多订单',
        duration: 3000
      });
      */

      return false;
    }

    this.loadOrderList(this.data.status, this.data.page + 1, this.data.page_size);
  },

  /**
   * 加载订单列表
   */
  loadOrderList: function(status, page, page_size, callback) {
    if(this.data.loading) {
      return false;
    }

    var that = this;
    that.setData({
      loading: true
    });

    status = status || 0;
    page = page || 1;
    page_size = page_size || 10;

    var data = {
      status: status,
      page: page,
      size: page_size,
      token: app.globalData.token,
      act: 'view'
    };

    utils.request(config.service.delivery_order, data, 'GET', function(response) {
      if(response.data.error == 0) {
        var params = {
          page: page
        };

        if (response.data.delivery_orders.length < page_size) {
          params.to_end = true;
        }

        params.orders = response.data.delivery_orders;

        console.info(params);
        that.setData(params);
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      }

      that.setData({
        loading: false
      });

      if (typeof (callback) == 'function') {
        console.info('load order_list success call callback');
        callback();
      }
    }, null, true, '正在加载订单');
  },

  /**
   * 切换面板
   */
  switchTab: function(e) {
    this.setData({
      status: e.currentTarget.dataset.status
    });

    wx.startPullDownRefresh();
  },

  /**
   * 物流跟踪
   */
  trackOrder: function(e) {
    var sn = e.currentTarget.dataset.sn;

    wx.navigateTo({
      url: '/pages/delivery_order/track?sn=' + sn
    });
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    var that = this;

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '您确定要取消该订单？',
      success: function (e) {
        console.info(e);

        if (e.cancel) {
          return false;
        }

        var data = {
          delivery_order_sn: sn,
          opera: 'cancel',
          token: getApp().globalData.token
        };

        utils.request(config.service.delivery_order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.onPullDownRefresh();
              }
            }
          });
        });
      }
    });
  }
});