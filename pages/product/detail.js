// pages/product/detail.js
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
    product: {
      id: 1,
      name: "澳大利亚原瓶原装进口君叶RL88长相思干白葡萄酒",
      price: 1.00,
      market_price: 10.00,
      sale_count: 9999,
      image: "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
      gallery: [
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg"
      ],
      sort: 1,
      star: 4,
      inventory: 10,
      favouriate: false,
      is_recommend: true,
      detail: "<div><h2>产品详情</h2><img src=\"http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg\"/><img src=\"http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg\"/></div>",
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
    //加载产品详情富文本
    WxParse.wxParse('product_detail', 'html', that.data.product.detail, that, 5);
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
    this.data.product.favouriate ^= true;

    if(this.data.product.favouriate) {
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

    this.setData({
      product: this.data.product
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
    var product = this.data.product;
    var cart_item = {
      id: product.id,
      image: product.image,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      count: Math.min(product.inventory, this.data.count),
      checked: true,
      inventory: product.inventory
    };

    var cart = wx.getStorageSync('cart');
    var current_index = -1;
    if (!cart) {
      cart = [];
    }
    var url = '/pages/cart/index';

    //直接购买
    if (this.data.direct_buy) {
      url = '/pages/order/checkout';
    }

    for(var i = 0; i < cart.length; i++) {
      if (this.data.direct_buy && cart[i].id != product.id) {
        cart[i].checked = false;
      }

      if(cart[i].id == product.id) {
        current_index = i;
      }
    }

    if(current_index != -1) {
      cart_item.count = Math.min(product.inventory, cart[current_index].count + this.data.count);
      cart[current_index] = cart_item;
    } else {
      cart.push(cart_item);
    }

    wx.setStorageSync('cart', cart);

    if (this.data.direct_buy) {
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
        success: function() {
          wx.switchTab({
            url: url
          });
        },
        fail: function() {
          wx.switchTab({
            url: '/pages/index/index',
          });
        }
      });
    }
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