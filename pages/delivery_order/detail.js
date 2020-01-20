// pages/order/detail.js
const app = getApp();
const config = require('../../config');
const utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.sn) {
      wx.showModal({
        content: '参数错误',
        showCancel: false,
        success: function() {
          wx.navigateBack();
        }
      });
    }

    this.setData({
      'order.sn': options.sn
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    var data = {
      delivery_order_sn: this.data.order.sn,
      token: app.globalData.token,
      act: 'detail'
    };
    
    utils.request(config.service.delivery_order, data, 'GET', function(response) {
      if (response.data.error == 0) {
        var order = response.data.delivery_order;
        order.address = order.province_name + ' ' + order.city_name + ' ' + order.district_name + ' ' + order.group_name + ' ' + order.address;

        that.setData({
          order: order
        });
      } else {
        wx.showModal({
          title: '提示',
          content: response.data.message,
          showCancel: false,
          success: function() {
            wx.navigateBack();
          }
        });
      }
    }, null, true, '正在加载订单');
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = this.data.order.sn;

    wx.showModal({
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
                that.onShow();
              }
            }
          });
        });
      }
    });
  }
});