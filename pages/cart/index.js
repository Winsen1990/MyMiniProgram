// pages/cart/index.js
var config = require('../../config');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    checkAll: false,
    amount: 0,
    checkedCount: 0,
    has_user_info: false,
    can_use: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options);
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
    if (!util.checkAuthorization()) {
      util.login(this.getCart);
      return false;
    }

    if(getApp().globalData.userInfo != null) {
      this.setData({
        has_user_info: true
      });
    }

    this.getCart();
  },

  /**
   * 初始化数据
   */
  getCart: function() {
    wx.showLoading({
      title: '',
    });

    var that = this;
    wx.request({
      url: config.service.cart,
      method: 'GET',
      data: { act: 'view', token: getApp().globalData.token },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (response) {
        if (response.data.error == 0) {
          that.setData({
            cart: response.data.cart
          });
          that.summary();
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },

  /**
   * 全选/反选
   */
  checkAllProduct: function() {
    for (var i = 0; i < this.data.cart.length; i++) {
      this.data.cart[i].checked = !this.data.checkAll;
    }

    this.summary();
  },

  /**
   * 购物车产品增加数量
   */
  cartItemPlus: function(e) {
    var id = e.target.dataset.id;
    var index = -1;
    
    for (var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      if (product.id == e.target.dataset.id) {
        index = i;
        break;
      }
    }

    if(index <= -1) {
      return false;
    }

    var cart_item = this.data.cart[index];
    
    if(cart_item.count >= cart_item.inventory) {
      wx.showToast({
        icon: 'none',
        title: '库存不足'
      });
      return false;
    }

    cart_item.count++;
    this.data.cart[index].count = cart_item.count;

    this.setData({
      cart: this.data.cart
    });

    this.summary();
  },

  /**
   * 购物车产品减少数量
   */
  cartItemMinus: function(e) {
    var id = e.target.dataset.id;
    var index = -1;

    for (var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      if (product.id == e.target.dataset.id) {
        index = i;
        break;
      }
    }

    if (index <= -1) {
      return false;
    }

    var cart_item = this.data.cart[index];

    if (cart_item.count <= 1) {
      wx.showToast({
        icon: 'none',
        title: '最少购买1瓶'
      });
      return false;
    }

    cart_item.count--;
    this.data.cart[index].count = cart_item.count;

    this.setData({
      cart: this.data.cart
    });

    this.summary();
  },

  /**
   * 购物车产品勾选/取消勾选
   */
  toogleCartItem: function(e) {
    console.info(e);
    for (var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      if(product.id == e.target.dataset.id) {
        this.data.cart[i].checked = !product.checked;
        break;
      }
    }
    this.summary();
  },

  /**
   * 计算购物车总价
   */
  summary: function() {
    this.data.amount = 0;
    this.data.checkedCount = 0;
    this.data.checkAll = true;
    for (var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      this.data.checkAll &= product.checked;
      if (product.checked) {
        this.data.amount += product.price * product.count;
        this.data.checkedCount++;
      }
    }

    console.info(this.data);
    this.setData(this.data);
  },

  /**
   * 前往填写订单
   */
  checkOrder: function() {
    var cart = [];
    for (var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      if (product.checked) {
        cart.push(product);
      }
    }

    wx.setStorage({
      key: 'cart',
      data: cart,
    });

    wx.navigateTo({
      url: '/pages/order/checkout',
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