// pages/product/detail.js
var WxParse = require('../../assets/wxParse/wxParse');
const utils = require('../../utils/util');
const config = require('../../config');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    product: {},
    shop: {},
    gallery: {
      index: 0,
      heights: [],
      width: 0,
      autoplay: false,
      displayDots: true,
      indicatorColor: '#bbbbbb',
      indicatorActiveColor: '#0b0b0b',
      duration: 800,
      interval: 5000
    },
    tabs: {
      current: 0,
      index: 'tab-0'
    },
    //猜你喜欢 
    favorite_products: [],
    can_checkout: true,
    displayPanel: false, //购买面板
    direct_buy: false, //直接购买
    count: 1, //购买数量
    member: {
      level_id: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕宽高
    var res = wx.getSystemInfoSync();
    var window_width = res.windowWidth;
    var window_height = res.windowHeight;

    that.setData({
      screen: {
        width: window_width,
        height: window_height
      },
      'gallery.width': window_width,
      member: app.globalData.userInfo
    });

    var data = {
      id: options.id || 0,
      act: 'show',
      token: app.globalData.token
    };

    utils.request(config.service.product, data, 'GET', function(response) {
      if(response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false,
          success: function() {
            wx.navigateBack();
          }
        });
      } else {
        that.setData({
          product: response.data.product,
          shop: response.data.shop,
          can_checkout: response.data.product.inventory >= 1
        });
        //产品详情
        WxParse.wxParse('product_detail', 'html', that.data.product.detail, that, 5);
        //包装售后
        WxParse.wxParse('product_after_sale', 'html', that.data.product.after_sale, that, 5);
        //替换当前页面标题啊
        wx.setNavigationBarTitle({
          title: response.data.product.name,
        });

        //限时促销计时器
        if (that.data.product.is_promote) {
          // setTimeout(function() {
            var activity_timer = setInterval(function () {
              if (that.data.product.promote_left <= 0) {
                clearInterval(activity_timer);
                activity_timer = null;
              }

              var _left_time = that.data.product.promote_left;
              if (_left_time <= 0) {
                that.setData({
                  'product.promote_left': 0,
                  'product.is_promote': false
                });
              } else {
                var _hour = parseInt(_left_time / 3600);
                var _minute = parseInt((_left_time % 3600) / 60);
                var _second = _left_time % 60;
                var _activity_status = {};
                _activity_status['product.hour'] = _hour;
                _activity_status['product.minute'] = _minute > 9 ? _minute : '0' + _minute;
                _activity_status['product.second'] = _second > 9 ? _second : '0' + _second;
                _activity_status['product.promote_left'] = _left_time - 1;

                that.setData(_activity_status);
              }
            }, 1000);
          // }, 600);
        }
      }
    });

    utils.request(config.service.favorite, null, 'GET', function (response) {
      //猜你喜欢
      that.setData({
        favorite_products: response.data.products
      });
    });
  },

  /**
   * 产品收藏
   */
  collection: function() {
    var that = this;
    var data = {
      opera: 'collection',
      product_sn: this.data.product.product_sn,
      token: app.globalData.token
    };

    utils.request(config.service.product, data, 'POST', function(response) {
      if(response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      } else {
        that.setData({
          'product.collection': that.data.product.collection ^ true
        });
      }
    });
  },

  /**
   * 减少数量
   */
  countMinus: function () {
    var count = this.data.count;

    count = Math.min(count, this.data.product.inventory);

    if (count > 1) {
      count--;
    }

    this.setData({
      count: count
    });
  },

  /**
   * 数量增加
   */
  countPlus: function () {
    var count = this.data.count;

    count = Math.min(count, this.data.product.inventory);

    if (count < this.data.product.inventory) {
      count++;

    }

    this.setData({
      count: count
    });
  },

  /**
   * 输入数量
   */
  countInput: function (e) {
    var count = e.detail.value;
    count = parseInt(count);

    if (isNaN(count) || count <= 0) {
      count = 1;
    }
    count = Math.min(count, this.data.product.inventory);

    this.setData({
      count: count
    });
  },

  /**
   * 弹出购买层
   */
  showBuyPanel: function () {
    this.setData({
      displayPanel: true
    });
  },

  /**
   * 收起购买层
   */
  hideBuyPanel: function () {
    this.setData({
      displayPanel: false,
      direct: false
    });
  },

  /**
   * 加入购物车
   */
  addToCart: function() {

    if (!this.data.can_checkout) {
      wx.showToast({
        title: '当前地区缺货',
      });
      return;
    }

    this.setData({
      direct_buy: false
    });

    this.buy();
  },

  /**
   * 直接购买
   */
  buyNow: function() {

    if (!this.data.can_checkout) {
      wx.showToast({
        title: '当前地区缺货',
      });
      return ;
    }

    this.setData({
      direct_buy: true
    });

    this.buy();
  },

  /**
   * 定级产品直接购买
   */
  directBuy: function() {
    wx.navigateTo({
      url: '/pages/cart/checkout?direct_buy=1&direct_buy_product_id=' + this.data.product.id,
    });
  },

  /**
   * 确定购买
   */
  buy: function () {
    var that = this;
    var data = {
      opera: 'add',
      product_id: this.data.product.id,
      count: this.data.count,
      token: app.globalData.token,
      direct: this.data.direct_buy
    };

    utils.request(config.service.cart, data, 'POST', function (response) {
      if (response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      } else {
        if (data.direct) {
          //直接购买
          wx.navigateTo({
            url: '/pages/cart/checkout'
          });
        } else {
          //加入购物车
          wx.showModal({
            content: response.data.message,
            cancelText: '继续逛逛',
            confirmText: '购物车',
            success: function (e) {
              if (e.confirm) {
                wx.switchTab({
                  url: '/pages/cart/index'
                });
              }
            }
          });
        }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var share_info = {
      title: this.data.product.name,
      path: '/pages/product/detail?recommend=' + app.globalData.account + '&id=' + this.data.product.id,
      imageUrl: this.data.product.img
    };

    return share_info;
  },

  /*------------------------ 轮播图 -------------------------------*/
  //轮播图加载完毕
  galleryLoad: function (e) {
    //获得原始尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    //宽高比
    var ratio = width / height;
    //计算图片缩放后高度并存入数组
    var heights = this.data.gallery.heights;
    heights.push(this.data.screen.width / ratio);

    this.setData({
      'gallery.heights': heights
    });
  },
  //轮播图切换
  galleryChange: function (target) {
    this.setData({
      'gallery.index': target.detail.current
    });
  },
  //轮播图点击
  galleryTap: function (e) {
    var index = this.data.gallery.index;
  },
  /*------------------------ 轮播图 End -------------------------------*/
  /*------------------------ tabs -------------------------------*/
  //点击切换面板
  tabSwitch: function (e) {
    this.setData({
      'tabs.current': e.currentTarget.dataset.id,
      'tabs.index': 'tab-' + e.currentTarget.dataset.id
    });
  },
  /*------------------------ tabs End -------------------------------*/
});