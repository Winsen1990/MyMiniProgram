// pages/cart/checkout.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    inventory: {},
    can_submit: false,
    id: 0
  },

  onLoad: function(options) {
    this.setData({
      id: options.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;

    //默认收货地址
    var address = wx.getStorageSync('address');
    if(!address) {
      utils.request(config.service.address, {
          token: app.globalData.token,
          act: 'get_default' 
        }, 'GET', function(response) {
          if(response.data.error == 0) {

            that.setData({
              address: response.data.address
            });
          }
        });
    } else {
      that.setData({
        address: address
      });
      that.checkAvailable();
    }

    //库存详情
    var data = {
      token: app.globalData.token,
      act: 'show',
      id: this.data.id
    };

    utils.request(config.service.inventory, data, 'GET', function (response) {

      if (response.data.error != 0) {
        wx.showModal({
          title: '提示',
          content: response.data.message,
          showCancel: false
        });
      } else {
        response.data.inventory.count = Math.min(1, response.data.inventory.inventory_logic);
        that.setData({
          inventory: response.data.inventory
        });

        that.checkAvailable();
      }
    });
  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    var data = {
      opera: 'create',
      token: app.globalData.token,
      products: [],
      address_id: this.data.address.id
    }

    if (data.address_id <= 0) {
      wx.showToast({
        title: '请选择收货地址'
      });

      setTimeout(function () {
        wx.hideToast();
      }, 3000);

      return false;
    }

    if(this.data.inventory.count <= 0) {
      wx.showToast({
        title: '请输入提货数量'
      });

      setTimeout(function () {
        wx.hideToast();
      }, 3000);

      return false;
    }
    data.products.push({
      id: this.data.inventory.id,
      count: this.data.inventory.count
    });

    wx.showLoading({
      title: '正在提交库存订单',
    });

    wx.request({
      url: config.service.delivery_order,
      data: data,
      method: 'POST',
      success: function (response) {
        if (response.data.error == 0) {
          wx.showModal({
            title: '',
            content: response.data.message,
            confirmText: '查看库存',
            cancelText: '查看订单',
            success: function (e) {
              if (e.confirm) {
                wx.redirectTo({
                  url: '/pages/inventory/index'
                });
              }

              if (e.cancel) {
                wx.redirectTo({
                  url: '/pages/delivery_order/detail?sn=' + response.data.delivery_order_sn
                });
              }
            },
            fail: function () {

            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },

  /**
 * 减少数量
 */
  cartItemMinus: function (e) {
    var count = this.data.inventory.count;
    count = Math.min(count, this.data.inventory.inventory_logic);

    if (count > 1) {
      count--;
    }

    var data = {};
    data['inventory.count'] = count;

    this.setData(data);
    this.checkAvailable();
  },

  /**
   * 增加数量
   */
  cartItemPlus: function (e) {
    var count = this.data.inventory.count;
    count = Math.min(count, this.data.inventory.inventory_logic);

    if (count < this.data.inventory.inventory_logic) {
      count++;
    }

    var data = {};
    data['inventory.count'] = count;

    this.setData(data);
    this.checkAvailable();
  },

  /**
   * 填写数量
   */
  inputCartCount: function (e) {
    var count = e.detail.value;
    var cart_id = e.currentTarget.dataset.id;

    count = parseInt(count);

    if (isNaN(count) || count <= 0) {
      count = 1;
    }

    count = Math.min(this.data.inventory.inventory_logic, count);

    var data = {};
    data['inventory.count'] = count;

    this.setData(data);
    this.checkAvailable();
  },

  checkAvailable: function () {
    var flag = this.data.address.id > 0;
    flag &= this.data.inventory.count <= this.data.inventory.inventory_logic;

    this.setData({
      can_submit: flag
    });
  }
});