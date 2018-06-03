// pages/address/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 操作函数--编辑收货地址
   */
  editAddress: function (e) {
    var category_id = e.currentTarget.dataset.id;

    console.info("tap on category id:" + category_id);
    category_id = parseInt(category_id);

    if (isNaN(category_id) || category_id <= 0) {
      wx.showToast({
        title: '参数错误',
      });
    } else {
      wx.navigateTo({
        url: '/pages/product/index?c_id=' + category_id,
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