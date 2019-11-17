// pages/category/index.js
const utils = require('../../utils/util');
const config = require('../../config');
var app = getApp();
var category_segements = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    current: 0,
    current_category: '',
    tap_category: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    utils.request(config.service.category, null, 'GET', function(response) {
      that.setData({
        categories: response.data.categories
      });

      if(response.data.categories.length) {
        that.setData({
          current: response.data.categories[0].id
        });

        setTimeout(function() {
          const query = wx.createSelectorQuery().in(that);
          query.selectAll('.category-segement').boundingClientRect();
          query.exec(function (rects) {
            for (var i = 0; i < rects[0].length; i++) {
              console.info(rects[0][i]);
              category_segements.push({
                id: rects[0][i].dataset.id,
                top: i == 0 ? 0 : rects[0][i].top
              });
            }

            console.info(category_segements);

            var params = wx.getStorageSync('category_param');
            console.info(params);

            if(params) {
              that.setData({
                current: params.category_id,
                current_sub_category: 'category-' + params.category_id,
                tap_category: true
              });

              wx.removeStorageSync('category_param');
            }
          });
        }, 800);
      }
    });
  },

  onShow: function() {
    var params = wx.getStorageSync('category_param');
    console.info(params);

    if (params && category_segements.length) {
      this.setData({
        current: params.category_id,
        current_sub_category: 'category-' + params.category_id,
        tap_category: true
      });

      wx.removeStorageSync('category_param');
    }
  },

  //一级分类点击事件
  categoryTap: function(e) {
    this.setData({
      current: e.currentTarget.dataset.id,
      current_sub_category: 'category-' + e.currentTarget.dataset.id,
      tap_category: true
    });
  },

  categoryScroll: function(e) {
    var category = 0;
    for(var i = 0; i < category_segements.length; i++) {
      if (e.detail.scrollTop >= category_segements[i].top) {
        category = category_segements[i].id;
      }
    }

    if(category > 0 && category != this.data.current) {
      if(this.data.tap_category) {
        this.setData({
          tap_category: false
        });
      } else {
        this.setData({
          current: category
        });
      }
    }
  },

  /**
   * 产品添加到购物车
   */
  addToCart: function (e) {
    var data = {
      opera: 'add',
      product_id: e.currentTarget.dataset.id,
      count: 1,
      token: app.globalData.token
    };

    utils.request(config.service.cart, data, 'POST', function (response) {
      wx.showToast({
        title: response.data.message,
        icon: response.data.error != 0 ? 'none' : 'success',
        duration: 3000
      });
    });
  }
});