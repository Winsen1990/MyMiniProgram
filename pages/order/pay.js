// pages/order/pay.js
var config = require('../../config');
var util = require('../../utils/util.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    order_sn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_sn = options.sn || '';

    if (this.data.order_sn == '') {
      wx.showModal({
        title: '',
        content: '参数错误',
        showCancel: false,
        complete: function () {
          wx.navigateBack();
        }
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
    var that = this;

    if (this.data.order_sn != '') {
      var data = {
        sn: this.data.order_sn,
        act: 'show',
        token: getApp().globalData.token
      };

      util.request(config.service.order, data, 'GET', function (response) {
        if (response.data.error == 0) {
          that.setData({
            order: response.data.order
          });
        }
      });
    }
  },

  pay: function () {
    var that = this;

    var data = {
      order_sn: this.data.order_sn,
      token: getApp().globalData.token,
      opera: 'pay'
    };

    util.request(config.service.order, data, 'POST', function (response) {
      if (response.data.error == 0) {
        wx.requestPayment({
          timeStamp: '' + response.data.timestamp,
          nonceStr: response.data.nonce_str,
          package: 'prepay_id=' + response.data.prepay_id,
          signType: 'MD5',
          paySign: response.data.sign,
          success: function (e) {
            console.info(e);
            wx.redirectTo({
              url: '/pages/order/detail?sn=' + data.order_sn,
            });
          },
          fail: function () {
            wx.showModal({
              content: '支付遇到问题？',
              confirmText: '继续支付',
              cancelText: '遇到问题',
              success: function(e) {
                if(e.confirm) {
                  that.pay();
                }
              }
            });
          },
          complete: function () {

          }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});