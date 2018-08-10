//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

var pageModel = Page({
    data: {
      imgUrls: [],
      recommendProducts: [],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      banner_width: 0,
      banner_heights: [],
      current_banner: 0,
      screen_width: 0,
      screen_height: 0,
      keyword: ""
    },
    imageLoad: function(e) {
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
    bindChange: function(e) {
      this.setData({
        current_banner: e.detail.current
      });
    },
    bannerTap: function(e) {
      console.info("tap on " + this.data.current_banner);
    },
    //获取关键词
    getKeyword: function(e) {
      this.setData({
        keyword: e.detail.value
      });
    },
    //关键词搜索
    keywordSearch: function(e) {
      console.info(this.data.keyword);
      wx.navigateTo({ url: "/pages/product/index"});
    },
    onLoad: function() {
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

      wx.request({
        url: config.service.index,
        success: (response) => {
          var ad_list = [];

          for(var i = 0; i < response.data.ads.length; i++) {
            ad_list.push(response.data.ads[i].url);
          }

          that.setData({
            imgUrls: ad_list,
            recommendProducts: response.data.recommend_products
          });
        }
      });
    },
    onPullDownRefresh: function() {
      wx.stopPullDownRefresh();
    }
});