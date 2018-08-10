// pages/category/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    current_view: '',
    current_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.service.category,
      success: (response) => {
        that.setData({
          categories: response.data.categories
        });

        if(response.data.categories.length) {
          this.setData({
            current_id: response.data.categories[0].id
          });
        }
      }
    })
  },

  /**
   * 操作函数--点击产品分类
   */
  selectCategory: function (e) {
    var category_id = e.currentTarget.dataset.id;

    console.info("tap on category id:" + category_id);
    category_id = parseInt(category_id);

    this.setData({
      current_view: 'category-' + category_id,
      current_id: category_id
    })
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