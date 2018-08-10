// pages/order/detail.js
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    order_sn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_sn = options.sn;
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
    wx.showToast({
      icon: 'loading'
    });

    wx.request({
      url: config.service.order,
      method: 'GET',
      data: { sn: that.data.order_sn, token: getApp().globalData.token, act: 'show' },
      success: function(response) {
        if(response.data.error == 0) {
          that.setData({
            order: response.data.order
          });
        } else {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false
          });
        }
      },
      complete: function() {
        wx.hideToast();
      }
    });
  },

  cancelOrder: function (e) {
    var that = this;
    console.info(e);

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

        util.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.order.status = 11;
                that.setData({
                  order: that.data.order
                });
              }
            }
          });
        });
      }
    });
  },

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

        util.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.order.status = 7;
                that.setData({
                  order: that.data.order
                });
              }
            }
          });
        });
      }
    });
  },

  rollbackOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '要申请退单？',
      success: function (e) {
        console.info(e);
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'rollback',
          token: getApp().globalData.token
        };

        util.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.order.status = 8;
                that.setData({
                  order: that.data.order
                });
              }
            }
          });
        });
      }
    });
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
    wx.stopPullDownRefresh();
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
  
  }
})