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
    function_rows: [],
    //产品专区
    blocks: [],
    //限时促销
    activities: [],
    activity_timer: null
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
        var function_rows = [];
        var _row = [];
        for(var i = 0; i < response.data.functions.length; i++) {
          _row.push(response.data.functions[i]);

          if((i + 1)%4 === 0 || (i+1) === response.data.functions.length) {
            function_rows.push(_row);
            _row = [];
          }
        }
        
        var space_padding = Math.ceil(response.data.functions.length / 4) * 4 - response.data.functions.length;
        while(space_padding--) {
          function_rows[function_rows.length - 1].push({
            name: '    ',
            url: '',
            icon: '/assets/images/empty.png'
          });
        }
        console.info(function_rows);

        that.setData({
          function_rows: function_rows
        });
      }

      //限时促销
      if(response.data.activities.length) {
        for(var i = 0; i < response.data.activities.length; i++) {
          response.data.activities[i]['hour'] = 0;
          response.data.activities[i]['minute'] = 0;
          response.data.activities[i]['second'] = 0;
        }

        that.setData({
          activities: response.data.activities
        });

        that.data.activity_timer = setInterval(function() {
          if(that.data.activities.length == 0) {
            clearInterval(that.data.activity_timer);
            that.data.activity_timer = null;
          }

          for (var i = 0; i < that.data.activities.length; i++) {
            var _activity = that.data.activities[i];
            
            var _left_time = _activity.time_left;
            if(_left_time <= 0) {
              that.data.activities.splice(i, 1);
              that.setData({
                activities: that.data.activities
              });
              continue;
            }

            var _hour = parseInt(_left_time/3600);
            var _minute = parseInt((_left_time%3600)/60);
            var _second = _left_time%60;
            var _activity_status = {};
            _activity_status['activities[' + i + '].hour'] = _hour;
            _activity_status['activities[' + i + '].minute'] = _minute;
            _activity_status['activities[' + i + '].second'] = _second;
            _activity_status['activities[' + i + '].time_left'] = _left_time - 1;

            that.setData(_activity_status);
          }
        }, 1000);
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

    if (url == '/pages/index/index' || url == '/pages/feed/index' || url == '/pages/cart/index' || url == '/pages/home/index' || url == '/pages/member/index') {
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
    var url = e.currentTarget.dataset.url;

    if (url == '/pages/index/index' || url == '/pages/feed/index' || url == '/pages/cart/index' || url == '/pages/home/index' || url == '/pages/member/index') {
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
  onShareAppMessage: function () {
    return {
      title: '好当家官方商城，全程定制您的健康生活',
      path: '/pages/index/index?recommend=' + app.globalData.account,
      imageUrl: 'http://img.hdjshop.cn/image/share-cover.png'
    }
  }
});
