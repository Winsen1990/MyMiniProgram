// pages/order/serve.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: '',
    detail_id: 0,
    detail: {},
    serve_type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.sn == '' || options.id <= 0) {
      wx.showModal({
        content: '参数错误',
        showCancel: false,
        success: function() {
          wx.navigateBack();
        }
      });
    }

    var data = {
      token: app.globalData.token,
      order_sn: options.sn,
      id: options.id,
      act: 'detail'
    };

    utils.request(config.service.order, data, 'GET', function(response) {
      if(response.data.error == 0) {
        that.setData({
          order_sn: options.sn,
          detail_id: options.id,
          detail: response.data.detail
        });
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false,
          success: function() {
            wx.navigateBack();
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
   * 选择服务类型
   */
  selectServeType: function(e) {
    this.setData({
      serve_type: e.currentTarget.dataset.type
    });
  },

  /**
   * 发起申请
   */
  requireServe: function() {
    var that = this;
    var data = {
      token: app.globalData.token,
      opera: 'rollback',
      order_sn: this.data.order_sn,
      serve_type: this.data.serve_type
    };

    utils.request(config.service.order, data, 'POST', function(response) {
      wx.showModal({
        content: response.data.message,
        showCancel: false,
        success: function() {
          if(response.data.error == 0) {
            wx.navigateBack();
          }
        }
      });
    }, null, true, '正在提交申请');
  }
});