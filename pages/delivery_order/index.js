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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadOrderList(this.data.status, 1, this.data.page_size);
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

    utils.request(config.service.order, data, 'GET', function(response) {
      if(response.data.error == 0) {
        var params = {
          page: page
        };

        if(response.data.order_list.length < page_size) {
          params.to_end = true;
        }

        params.orders = response.data.order_list;

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
   * 支付订单
   */
  payOrder: function(e) {
    var sn = e.currentTarget.dataset.sn;

    wx.navigateTo({
      url: '/pages/order/pay?sn=' + sn
    });
  },

  /**
   * 物流跟踪
   */
  trackOrder: function(e) {
    var sn = e.currentTarget.dataset.sn;

    wx.navigateTo({
      url: '/pages/order/track?sn=' + sn
    });
  },

  /**
   * 申请退单
   */
  rollbackOrder: function(e) {
    var sn = e.currentTarget.dataset.sn;
    var detail_id = e.currentTarget.data.detailId;

    wx.navigateTo({
      url: '/pages/order/serve?sn=' + sn + '&id=' + detail_id
    });
  },

  /**
   * 订单评论
   */
  commentOrder: function (e) {
    var sn = e.currentTarget.dataset.sn;
    var detail_id = e.currentTarget.data.detailId;

    wx.navigateTo({
      url: '/pages/order/comment?sn=' + sn + '&id=' + detail_id
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
          sn: sn,
          opera: 'cancel',
          token: getApp().globalData.token
        };

        utils.request(config.service.order, data, 'POST', function (response) {
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
  },

  /**
   * 确定收货
   */
  receiveOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '您确定已收货？',
      success: function (e) {
        console.info(e);
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'receive',
          token: getApp().globalData.token
        };

        utils.request(config.service.order, data, 'POST', function (response) {
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