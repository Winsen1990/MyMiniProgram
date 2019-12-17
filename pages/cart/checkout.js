// pages/cart/checkout.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    direct_buy: 0,
    direct_buy_product_id: 0,
    notice_checked: true,
    use_balance: false,
    use_integral: false,
    use_reward: false,
    address: {},
    cart: [],
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
      coupon_decrement: 0,//优惠减免
      balance_reduce: 0, //余额抵扣
      integral_reduce: 0, //积分抵扣
      reward_reduce: 0, //佣金抵扣
      product_count: 0, //产品数量
    },
    wallet: {
      integral: 0,//积分
      balance: 0,//余额
      reward: 0, //佣金
      integral_rate: 0, //积分最多可抵用
      reward_rate: 0 //佣金最多可抵扣
    },
    can_submit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      direct_buy: options.direct_buy || 0,
      direct_buy_product_id: options.direct_buy_product_id || 0
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
    var that = this;

    var address = wx.getStorageSync('address');
    var direct_buy = this.data.direct_buy;
    var direct_buy_product_id = this.data.direct_buy_product_id;

    var data = {
      token: app.globalData.token,
      address_id: address ? address.id : 0,
      act: 'view',
      direct_buy: direct_buy,
      direct_buy_product_id: direct_buy_product_id
    };

    utils.request(config.service.checkout, data, 'GET', function (response) {
      var shipping_list = [];
      for (var i = 0; i < response.data.shipping.length; i++) {
        var shipping = response.data.shipping[i];

        shipping_list.push({
          id: shipping.id,
          name: shipping.name,
          shipping_fee: shipping.shipping_fee,
          business_id: shipping.business_id,
          selected: i == 0,
          area_id: shipping.area_id,
          delivery_id: shipping.id
        });
      }

      if(response.data.coupons) {
        response.data.coupons.splice(0, 0, {
          id: 0,
          coupon_sn: '',
          name: '不使用优惠券',
          discount: 0,
          decrement: 0,
          decrement_limit: 0,
          coupon_type: 2
        });

        that.setData({
          'coupon.name': '请选择优惠券'
        });
      }

      that.setData({
        wallet: response.data.wallet,
        address: response.data.address,
        shipping: shipping_list,
        coupons: response.data.coupons,
        cart: [
          {
            shop_id: response.data.shop.id,
            shop_name: response.data.shop.name,
            remark: '',
            amount: 0,
            products: response.data.cart
          }
        ]
      });

      that.caculateSummary();

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

  use_wallet: function (e) {
    console.info(e.currentTarget.dataset.mode);

    switch (e.currentTarget.dataset.mode) {
      case 'balance':
        this.data.use_balance ^= true;
        break;

      case 'integral':
        this.data.use_integral ^= true;
        break;

      case 'reward':
        this.data.use_reward ^= true;
        break;
    }

    this.caculateSummary();
  },

  /**
   * 计算订单金额
   */
  caculateSummary: function () {
    var summary = {
      amount: 0,//订单合计
      product_amount: 0,//产品合计
      shipping_amount: 0,//运费合计
      coupon_decrement: 0,//优惠减免
      balance_reduce: 0, //余额抵扣
      integral_reduce: 0, //积分抵扣
      reward_reduce: 0, //佣金抵扣
      product_count: 0, //产品数量
    }

    //产品合计
    for (var i = 0; i < this.data.cart[0].products.length; i++) {
      var product = this.data.cart[0].products[i];
      summary.amount += product.price * product.count;
      summary.product_amount += product.price * product.count;
      summary.product_count += product.count;
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

    if(this.data.use_integral) {
      summary.integral_reduce = Math.min(summary.amount, this.data.wallet.integral/this.data.wallet.integral_rate);
      summary.amount -= summary.integral_reduce;
    }

    if (this.data.use_reward) {
      summary.reward_reduce = Math.min(summary.amount, this.data.wallet.reward / this.data.wallet.reward_rate);
      summary.amount -= summary.reward_reduce;
    }

    if(this.data.use_balance) {
      summary.balance_reduce = Math.min(summary.amount, this.data.wallet.balance);
      summary.amount -= summary.balance_reduce;
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
      delivery_list: {},
      direct_buy: this.data.direct_buy,
      direct_buy_product_id: this.data.direct_buy_product_id
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