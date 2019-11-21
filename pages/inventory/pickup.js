// pages/cart/checkout.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice_checked: true,
    address: {},
    product: {},
    cart: [],
    /*
    {
      id: 0,
      coupon_sn: '',
      name: '不使用优惠券',
      discount: 0,
      decrement: 0,
      decrement_limit: 0,
      coupon_type: 2
    }
    */
    coupons: [],
    coupon: {
      id: 0,
      coupon_sn: '',//优惠券号
      name: '暂无可用优惠',//优惠券名称
      discount: 0,//折扣
      decrement: 0,//减免金额
      decrement_limit: 0,//减免金额上限
      coupon_type: 0//优惠券类型
    },
    shipping: [{
      id: 1,//物流方式ID
      name: '免运费',//物流方式名称
      shipping_fee: 0,//运费
      selected: true//是否选择
    }],
    summary: {
      amount: 0,//订单合计
      product_amount: 0,//产品合计
      shipping_amount: 0,//运费合计
      coupon_decrement: 0//优惠减免
    },
    can_submit: false,
    pickupId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty('id')) {
      this.data.pickupId = options.id;
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
    var that = this;

    var address = wx.getStorageSync('address');

    var data = {
      token: app.globalData.token,
      address_id: address ? address.id : 0,
      act: 'view',
      id: this.data.pickupId,
    };

    utils.request(config.service.pickup, data, 'GET', function (response) {

      that.setData({
        address: response.data.address,
        product: response.data.product,
      });

      if (response.data.error != 0) {
        wx.showModal({
          title: '提示',
          content: response.data.message,
          showCancel: false
        });

        that.setData({
          can_submit: false
        });
      } else {
        if (response.data.address.id) {
          that.setData({
            can_submit: true
          });
        } else {
          that.setData({
            can_submit: false
          });
        }
      }
    });
  },

  /**
   * 计算订单金额
   */
  caculateSummary: function () {
    var summary = {
      amount: 0,//订单合计
      product_amount: 0,//产品合计
      shipping_amount: 0,//运费合计
      coupon_decrement: 0//优惠减免
    }

    //产品合计
    for (var i = 0; i < this.data.cart[0].products.length; i++) {
      var product = this.data.cart[0].products[i];
      summary.amount += product.price * product.count;
      summary.product_amount += product.price * product.count;
    }

    //运费
    for (var i = 0; i < this.data.shipping.length; i++) {
      var shipping = this.data.shipping[i];

      if (shipping.selected) {
        summary.amount += shipping.shipping_fee;
        summary.shipping_amount = shipping.shipping_fee;
        break;
      }
    }

    //优惠减免
    if (this.data.coupon.id >= 0) {
      var coupon_reduce = 0;
      switch(this.data.coupon.coupon_type) {
        case 1:
          //折扣券
          coupon_reduce = summary.product_amount * this.data.coupon.discount;
          coupon_reduce = Math.min(coupon_reduce, this.data.coupon.decrement_limit);
          break;

        case 2:
          //代金券
        case 3:
          //满减券
          coupon_reduce = this.data.coupon.decrement;
          break;
      }
      summary.coupon_decrement = coupon_reduce;

      summary.amount -= summary.coupon_decrement;
    }

    this.setData({
      summary: summary,
      'cart[0].amount': summary.product_amount
    });
  },

  /**
   * 选择优惠券
   */
  selectCoupon: function(e) {
    var coupon = this.data.coupons[e.detail.value];

    if(coupon) {
      this.setData({
        coupon: coupon
      });

      this.caculateSummary();
    }
  },

  /**
   * 监听短信通知选项
   */
  messageNotice: function () {
    this.setData({
      messageNotice: this.data.messageNotice ^ true
    });
    console.info(this.data.messageNotice);
  },

  /**
   * 记录留言
   */
  recordRemark: function (e) {
    this.setData({
      'cart[0].remark': e.detail.value
    });
  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    var data = {
      message_notice: this.data.messageNotice,
      address_id: this.data.address.id,
      remark: this.data.cart[0].remark,
      coupon_sn: this.data.coupon.coupon_sn,
      opera: 'add',
      token: app.globalData.token,
      delivery_list: {}
    }

    for (var j = 0; j < this.data.shipping.length; j++) {
      var shipping = this.data.shipping[j];

      if (shipping.selected) {
        data.delivery_list[shipping.business_id] = [shipping];
        break;
      }
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

    wx.showLoading({
      title: '正在提交订单',
    });

    wx.request({
      url: config.service.order,
      data: data,
      method: 'POST',
      success: function (response) {
        if (response.data.error == 0) {
          wx.showModal({
            title: '',
            content: response.data.message,
            confirmText: '前往支付',
            cancelText: '查看订单',
            success: function (e) {
              if (e.confirm) {
                wx.redirectTo({
                  url: '/pages/order/pay?sn=' + response.data.order_sn
                });
              }

              if (e.cancel) {
                wx.redirectTo({
                  url: '/pages/order/detail?sn=' + response.data.order_sn
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
  
  }
});