// pages/product/detail.js
var config = require('../../config');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    banner_width: 0,
    banner_heights: [],
    current_banner: 0,
    screen_width: 0,
    screen_height: 0,
    current_tab: 'detail_panel',
    login: false,
    can_use: wx.canIUse('button.open-type.getUserInfo'),
    product: {
      id: 0,
      name: "",
      price: 0.00,
      market_price: 0.00,
      sale_count: 0,
      image: "",
      gallery: [],
      sort: 0,
      star: 0,
      inventory: 0,
      favorite: false,
      is_recommend: true,
      detail: "",
      comments: []
    },
    count: 1,//购买数量
    direct_buy: false,//是否直接购买
    show_popup: false
  },
  /**
   * 产品相册加载事件
   */
  imageLoad: function (e) {
    //获取图片真实宽度
    var img_width = e.detail.width;
    var img_height = e.detail.height;
    //宽高比
    var ratio = img_width / img_height;
    console.log(img_width, img_height);
    //计算的高度值
    var view_height = this.data.screen_width / ratio;
    var img_height = view_height;
    var banner_heights = this.data.banner_heights;
    //把每一张图片的高度记录到数组里
    banner_heights.push(img_height);
    this.setData({
      banner_width: img_width,
      banner_heights: banner_heights
    });
  },
  /**
   * 产品相册切换事件
   */
  bindChange: function (e) {
    this.setData({
      current_banner: e.detail.current
    });
  },
  bannerTap: function (e) {
    console.info("tap on " + this.data.current_banner);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取参数
    console.info(options);
    var that = this;
    //获取屏幕宽高  
    wx.getSystemInfo({
      success: function (res) {
        var window_width = res.windowWidth;
        var window_height = res.windowHeight;

        that.setData({
          screen_width: window_width,
          screen_height: window_height
        });
      }
    });

    //
    wx.request({
      url: config.service.product,
      data: {id: options.id},
      success: (response) => {
        if(response.data.error != 0) {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false,
            complete: function() {
              wx.navigateBack();
            }
          });
        } else {
          that.setData({
            product: response.data.product
          });

          //加载产品详情富文本
          WxParse.wxParse('product_detail', 'html', that.data.product.detail, that, 5);
        }
      }
    });
  },

  showDetailPanel: function() {
    this.setData({
      current_tab: 'detail_panel'
    });
  },

  showCommentPanel: function() {
    this.setData({
      current_tab: 'comment_panel'
    });
  },

  onShareAppMessage: function (res) {
    var that = this;

    var share_message = {
      title: that.data.product.name,
      path: '/pages/product/detail?id=' + this.data.product.id,
      imageUrl: that.data.product.image
    };

    console.info(share_message);

    return share_message;
  },

  /**
   * 收藏/取消收藏
   */
  toogleFav: function() {
    var that = this;
    if(!util.checkAuthorization()) {
      util.login(this.toogleFav);
      return false;
    }

    wx.request({
      url: config.service.collection,
      data: { id: this.data.product.id, token: getApp().globalData.token },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        if(response.data.error == 0) {
          that.data.product.favouriate ^= true;

          if (that.data.product.favouriate) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'success'
            });
          }

          that.setData({
            product: that.data.product
          });
        } else {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false,
            complete: function() {
              if(response.data.error == 503) {
                util.login();
              }
            }
          });
        }
      }
    });
  },

  /**
   * 立即购买
   */
  buyNow: function() {
    console.info('buy now');
    this.data.direct_buy = true;

    this.showPopup();
  },

  /**
   * 加入购物车
   */
  addToCart: function() {
    console.info('add to cart');
    this.data.direct_buy = false;

    this.showPopup();
  },

  /**
   * 购买数量选择弹窗
   */
  showPopup: function() {
    this.setData({
      show_popup: true
    });
  },

  /**
   * 收起购买数量
   */
  hidePopup: function() {
    this.setData({
      show_popup: false
    });
  },

  /**
   * 购买数量减少
   */
  buyCountMinus: function() {
    if(this.data.count <= 1) {
      return false;
    }

    this.data.count--;

    this.setData({
      count: this.data.count
    });
  },

  /**
   * 购买数量增加
   */
  buyCountPlus: function () {
    if (this.data.count >= this.data.product.inventory) {
      return false;
    }

    this.data.count++;

    this.setData({
      count: this.data.count
    });
  },

  /**
   * 购买数量校验
   */
  buyCountValidation: function(target) {
    console.info(target);

    var count = target.detail.value;
    count = parseInt(count);

    if(isNaN(count) || count <= 0) {
      count = 1;
    }

    count = Math.min(this.data.product.inventory, count);

    this.setData({
      count: count
    });
  },

  /**
   * 提交购物车
   */
  confirmBuy: function() {
    var that = this;
    if (!util.checkAuthorization()) {
      util.login(this.confirmBuy);
      return false;
    }

    var product = this.data.product;
    var url = '/pages/cart/index';

    //直接购买
    if (this.data.direct_buy) {
      url = '/pages/order/checkout';
    }

    wx.request({
      url: config.service.cart,
      data: { opera: 'add', product_id: product.id, count: this.data.count, token: getApp().globalData.token },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        if(response.data.error == 0) {
          if (that.data.direct_buy) {
            var cart_item = {
              id: response.data.id,
              image: product.image,
              product_id: product.id,
              product_name: product.name,
              price: product.price,
              count: response.data.count,
              checked: true,
              inventory: product.inventory
            };

            wx.setStorageSync('cart', [cart_item]);

            wx.navigateTo({
              url: url
            });
          } else {
            wx.showModal({
              title: '',
              content: '加入购物车成功',
              cancelText: '继续逛逛',
              cancelColor: '#a3a3a3',
              confirmText: '去购物车',
              confirmColor: '#870020',
              success: function () {
                wx.switchTab({
                  url: url
                });
              },
              fail: function () {
                wx.switchTab({
                  url: '/pages/index/index',
                });
              }
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false
          });
        }
      }
    });
  },

  /**
   * 相册预览
   */
  galleryPreview: function() {
    console.info('tap on gallery');
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