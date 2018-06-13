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
      name: "产品一",
      price: 0.00,
      market_price: 0.00,
      sale_count: 0,
      image: "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
      gallery: [
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg",
        "http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg"
      ],
      sort: 1,
      star: 4,
      inventory: 1,
      favouriate: false,
      is_recommend: true,
      detail: "<div><h2>产品详情</h2><img src=\"http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg\"/><img src=\"http://img3m0.ddimg.cn/28/30/24198400-1_e_4.jpg\"/></div>",
      comments: []
    }
  },
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

    WxParse.wxParse('product_detail', 'html', that.data.product.detail, that, 5);
  },

  /**
   * 立即购买
   */
  buyNow: function() {
    console.info('buy now');
  },

  /**
   * 加入购物车
   */
  addToCart: function() {
    console.info('add to cart');
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