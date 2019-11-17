//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util');
const config = require('../../config');

Page({
  data: {
    //轮播图
    banners: [],
    banner: {
      index: 0,
      heights: [],
      width: 0,
      autoplay: false,
      displayDots: false,
      duration: 800,
      interval: 5000
    },
    under_banner_ads: [],
    before_block_ads: [],
    //功能区
    functions: [],
    //产品专区
    blocks: []
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    //获取屏幕宽高  
    wx.getSystemInfo({
      success: (res) => {
        var window_width = res.windowWidth;
        var window_height = res.windowHeight;

        that.setData({
          screen: {
            width: window_width,
            height: window_height
          },
          'banner.width': window_width
        });
      }
    });

    utils.request(config.service.index, null, 'GET', function(response) {
      //轮播图 广告图
      that.setData({
        banners: response.data.banners,
        under_banner_ads: response.data.under_banner_ads,
        before_block_ads: response.data.before_block_ads
      });

      //功能
      if(response.data.functions.length) {
        that.setData({
          functions: response.data.functions
        });
      }

      //产品专区
      if(response.data.blocks.length) {
        for(var i = 0; i < response.data.blocks.length; i++) {
          response.data.blocks[i].id = response.data.blocks[i].url.replace('/pages/category/index?id=', '');
        }

        that.setData({
          blocks: response.data.blocks
        });
      }
    });
  },
  /*------------------------ 轮播图 -------------------------------*/
  //轮播图加载完毕
  bannerLoad: function(e) {
    //获得原始尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    //宽高比
    var ratio = width/height;
    //计算图片缩放后高度并存入数组
    var heights = this.data.banner.heights;
    heights.push(this.data.screen.width/ratio);

    this.setData({
      'banner.heights': heights
    });
  },
  //轮播图切换
  bannerChange: function(target) {
    this.setData({
      'banner.index': target.detail.current
    });
  },
  //轮播图点击
  bannerTap: function(e) {
    var index = this.data.banner.index;
    var url = this.data.banners[index].url;

    console.info('tap on banner[' + index + ']:' + url);

    if(url == '/pages/index/index' || url == '/pages/category/index' || url == '/pages/feed/index' || url == '/pages/cart/index' || url == '/pages/home/index') {
      wx.switchTab({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },
  /*------------------------ 轮播图 End -------------------------------*/
  /*-------------------------------------------------------------------*/
  switchCategory: function(e) {
    console.info(e);
    var index = e.currentTarget.dataset.index;
    var url = this.data.functions[index].url;

    console.info('tap on functions[' + index + ']:' + url);

    if(url == '/pages/index/index' || url == '/pages/feed/index' || url == '/pages/cart/index' || url == '/pages/home/index') {
      wx.switchTab({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  /*
  onShareAppMessage: function () {
    return {
      title: '【森雲酒业】澳洲红酒狂欢节，买就送！仅限11.11日-18日',
      path: '/pages/index/index?recommend=' + app.globalData.account,
      imageUrl: 'https://www.buyauwines.com/upload/image/share-cover.png'
    }
  }
  */
});
