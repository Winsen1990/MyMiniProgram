// pages/category/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.info(options.c_id);

    wx.request({
      url: config.service.products,
      success: (response) => {
        that.setData({
          products: response.data.products
        });
      }
    });
  },

  /**
   * 业务函数--进入产品详情
   */
  selectProduct: function(e) {
    var product_id = e.currentTarget.dataset.id;
    product_id = parseInt(product_id);

    if(isNaN(product_id) || product_id <= 0) {
      wx.showToast({
        title: '参数错误',
      });
    } else {
      wx.showToast({
        title: '进入产品详情' + product_id,
      });

      wx.navigateTo({
        url: '/pages/product/detail?id=' + product_id,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})