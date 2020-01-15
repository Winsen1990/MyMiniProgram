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
      'order.order_sn': options.sn
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

    var data = {
      sn: this.data.order.order_sn,
      token: app.globalData.token,
      act: 'show'
    };
    
    utils.request(config.service.order, data, 'GET', function(response) {
      if (response.data.error == 0) {
        that.setData({
          order: response.data.order
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
   * 取消订单
   */
  cancelOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = this.data.order.order_sn;

    wx.showModal({
      content: '您确定要取消该订单？',
      success: function (e) {
        console.info(e);
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'cancel',
          token: app.globalData.token
        };

        utils.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.setData({
                  'order.status': 11,
                  'order.status_str': '无效订单'
                });
              }
            }
          });
        });
      }
    });
  },

  /**
   * 订单收货
   */
  receiveOrder: function (e) {
    var that = this;
    var sn = this.data.order.order_sn;

    wx.showModal({
      title: '',
      content: '您确定已收货？',
      success: function (e) {
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'receive',
          token: app.globalData.token
        };

        utils.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.setData({
                  'order.status': 7,
                  'order.status_str': '待评价'
                });
              }
            }
          });
        });
      }
    });
  }
});