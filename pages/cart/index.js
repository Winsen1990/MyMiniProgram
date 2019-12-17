// pages/cart/index.js
var config = require('../../config');
var utils = require('../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    amount: 0,
    product_count: 0,
    canCheckout: false,
    checkAll: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

    //购物车信息
    var data = {
      token: app.globalData.token,
      act: 'view'
    };

    utils.request(config.service.cart, data, 'GET', function (response) {
      console.info(response);
      if (response.data.error != 0 && response.data.error != 503) {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      } else {
        var checked = true;
        for(var i = 0; i < response.data.cart.length; i++) {
          var cart = response.data.cart[i];

          if(!cart.checked) {
            checked = false;
          }
        }

        if(response.data.cart.length) {
          that.setData({
            cart: response.data.cart
          });
        } else {
          that.setData({
            cart: []
          });
        }

        that.summary();
      }
    });

    console.info('hasUserInfo: ' + (app.globalData.userInfo ? 'true' : 'false'));

    that.setData({
      hasUserInfo: app.globalData.userInfo ? true : false
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var that = this;
    utils.syncUserInfo(e.detail, function () {
      that.checkout();
    });
  },

  /**
   * 根据ID查询购物车
   */
  seekProduct: function (id) {
    var res = {
      index: -1,
      product: null
    };

    for (var i = 0; i < this.data.cart[0].products.length; i++) {
      var product = this.data.cart[0].products[i];

      if (product.id == id) {
        res.index = i;
        res.product = product;
        break;
      }
    }

    return res;
  },

  /**
   * 选择店铺产品
   */
  selectShopItem: function() {
    var shop = this.data.cart[0];
    shop.checked ^= true;

    var data = {
      'cart[0].checked': shop.checked,
      checkAll: shop.checked
    };

    for(var i = 0; i < shop.products.length; i++) {
      data['cart[0].products[' + i + '].checked'] = shop.checked;
    }

    console.info(data);

    this.setData(data);
  },

  /**
   * 选择购物车产品
   */
  selectCartItem: function (e) {
    var data = {
      checkAll: e.detail.value.length == this.data.cart[0].products.length,
      'cart[0].checked': e.detail.value.length == this.data.cart[0].products.length
    };

    var selected_id_list = e.detail.value;

    for (var j = 0; j < this.data.cart[0].products.length; j++) {
      var product = this.data.cart[0].products[j];
      if (selected_id_list.indexOf(product.id) !== -1) {
        data['cart[0].products[' + j + '].checked'] = true;
      } else {
        data['cart[0].products[' + j + '].checked'] = false;
      }
    }

    console.info(data);

    this.setData(data);
    this.summary();
  },

  /**
   * 前往结算
   */
  checkout: function (e) {
    console.info('checkout');
    var cart = [];
    for (var i = 0; i < this.data.cart[0].products.length; i++) {
      var product = this.data.cart[0].products[i];

      cart.push({
        id: product.id,
        count: product.count,
        checked: product.checked ? 1 : 0
      });
    }

    var data = {
      token: app.globalData.token,
      cart: cart,
      opera: 'sync'
    };

    utils.request(config.service.checkout, data, 'POST', function (response) {
      if (response.data.error == 0) {
        wx.navigateTo({
          url: '/pages/cart/checkout',
        });
      } else {
        wx.showModal({
          content: response.data.message
        });
      }
    });
  },

  /**
   * 全选
   */
  selectAll: function () {
    this.data.checkAll ^= true;

    var data = {
      checkAll: this.data.checkAll,
      'cart[0].checked': this.data.checkAll
    };

    for (var i = 0; i < this.data.cart[0].products.length; i++) {
      data['cart[0].products[' + i + '].checked'] = this.data.checkAll;
    }

    this.setData(data);
    this.summary();
  },

  /**
   * 减少数量
   */
  cartItemMinus: function (e) {
    var cart_id = e.currentTarget.dataset.id;
    var cart_item = this.seekProduct(cart_id);

    if (cart_item.product) {
      cart_item.product.count = Math.min(cart_item.product.count, cart_item.product.inventory);

      if (cart_item.product.count > 1) {
        cart_item.product.count--;
      }

      var data = {};
      data['cart[0].products[' + cart_item.index + '].count'] = cart_item.product.count;

      this.setData(data);

      this.summary();
    }
  },

  /**
   * 增加数量
   */
  cartItemPlus: function (e) {
    var cart_id = e.currentTarget.dataset.id;
    var cart_item = this.seekProduct(cart_id);

    if (cart_item.product) {
      cart_item.product.count = Math.min(cart_item.product.count, cart_item.product.inventory);

      if (cart_item.product.count < cart_item.product.inventory) {
        cart_item.product.count++;
      }

      var data = {};
      data['cart[0].products[' + cart_item.index + '].count'] = cart_item.product.count;

      this.setData(data);

      this.summary();
    }
  },

  /**
   * 填写数量
   */
  inputCartCount: function (e) {
    var count = e.detail.value;
    var cart_id = e.currentTarget.dataset.id;
    var cart_item = this.seekProduct(cart_id);

    count = parseInt(count);

    if (isNaN(count) || count <= 0) {
      count = 1;
    }

    if (cart_item.product) {
      count = Math.min(cart_item.product.inventory, count);

      var data = {};
      data['cart[0].products[' + cart_item.index + '].count'] = count;

      this.setData(data);
      this.summary();
    }
  },

  /**
   * 移除购物车
   */
  removeCartItem: function (e) {
    var that = this;
    console.info(e);
    var data = {
      opera: 'delete',
      cid: e.currentTarget.dataset.id,
      token: app.globalData.token
    };

    wx.showModal({
      title: '',
      content: '您确定要移除该商品？',
      cancelText: '容朕想想',
      confirmText: '马上移除',
      success: function (e) {
        if (e.confirm) {
          utils.request(config.service.cart, data, 'POST', function (response) {
            if (response.data.error != 0) {
              wx.showModal({
                content: response.data.message,
                showCancel: false
              });
            } else {
              wx.showModal({
                title: '',
                content: response.data.message,
                showCancel: false,
                complete: function () {
                  that.onShow();
                }
              });
            }
          });
        }
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
  
  },

  /**
   * 计算合计
   */
  summary: function() {
    var amount = 0;
    var product_count = 0;
    var can_checkout = false;
    var cart = this.data.cart;
    for(var i = 0; i < cart.length; i++) {
      var shop = cart[i];
      for(var j = 0; j < shop.products.length; j++) {
        var product = shop.products[j];

        if(product.checked) {
          can_checkout = true;
          amount += product.price * product.count;
          product_count += product.count;
        }
      }
    }

    this.setData({
      amount: amount,
      product_count: product_count,
      canCheckout: can_checkout
    });
  },
});