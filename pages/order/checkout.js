// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    address: {
      consignee: '',//收件人
      id: 0,//地址ID
      detail: '',//详细地址
      mobile: ''//手机号码
    },
    shop: {
      id: 0,
      name: '澳臻世Ozonsh'
    },
    messageNotice: true,
    summary: {
      amount: 0,//订单合计
      product_amount: 0,//产品合计
      shipping_amount: 0,//运费合计
      coupon_decrement: 0//优惠减免
    },
    remark: '',//用户留言
    coupon: {
      desc: '暂无可用优惠',//优惠描述
      code: '',//优惠券号
      decrement: 0,
      discount: false
    },
    shipping: [{
      id: 1,//物流方式ID
      name: '免运费',//物流方式名称
      shipping_fee: 0,//运费
      selected: true//是否选择
    }]
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
    var that = this;

    var cart = [];
    var cart_tmp = wx.getStorageSync('cart');
    var address = wx.getStorageSync('address');
    var coupon = wx.getStorageSync('coupon');

    if (cart_tmp) {
      var cart_item;
      while(cart_item = cart_tmp.shift()) {
        if(cart_item.checked) {
          cart.push(cart_item);
        }
      }
    }

    if(!address) {
      address = {
        consignee: '',//收件人
        id: 0,//地址ID
        detail: '',//详细地址
        mobile: ''//手机号码
      };
    }

    if(!coupon) {
      coupon = {
        desc: '暂无可用优惠',//优惠描述
        code: '',//优惠券号
        decrement: 0,
        discount: false
      };
    }

    this.setData({
      cart: cart,
      address: address,
      coupon: coupon
    });

    this.caculateSummary();
  },

  /**
   * 计算订单金额
   */
  caculateSummary: function() {
    var summary = {
      amount: 0,//订单合计
      product_amount: 0,//产品合计
      shipping_amount: 0,//运费合计
      coupon_decrement: 0//优惠减免
    }

    //产品合计
    for(var i = 0; i < this.data.cart.length; i++) {
      var product = this.data.cart[i];
      summary.amount += product.price * product.count;
      summary.product_amount += product.price * product.count;
    }

    //运费
    for(var i = 0; i < this.data.shipping.length; i++) {
      var shipping = this.data.shipping[i];

      if(shipping.selected) {
        summary.amount += shipping.shipping_fee;
        summary.shipping_amount = shipping.shipping_fee;
        break;
      }
    }

    //优惠减免
    if(this.data.coupon.code != '') {
      if(this.data.coupon.discount) {
        summary.coupon_decrement = this.data.coupon.decrement * summary.product_amount;
      } else {
        summary.coupon_decrement = this.data.coupon.decrement;
      }
      summary.amount -= summary.coupon_decrement;
    }

    this.setData({
      summary: summary
    });
  },

  /**
   * 监听短信通知选项
   */
  messageNotice: function() {
    this.data.messageNotice ^= true;
    console.info(this.data.messageNotice);
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