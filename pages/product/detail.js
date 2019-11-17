// pages/product/detail.js
var WxParse = require('../../assets/wxParse/wxParse');
const utils = require('../../utils/util');
const config = require('../../config');
const app = getApp();
var regions = {};
var address = {
  province: 1,
  city: 1,
  district: 1
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    product: {},
    shop: {},
    gallery: {
      index: 0,
      heights: [],
      width: 0,
      autoplay: false,
      displayDots: true,
      indicatorColor: '#bbbbbb',
      indicatorActiveColor: '#870020',
      duration: 800,
      interval: 5000
    },
    tabs: {
      current: 0,
      index: 'tab-0'
    },
    support_delivery: false,
    can_checkout: false,
    region: ['省', '市', '区'],//省市区
    region_index: [0, 0, 0],
    regions: [
      [], //省
      [], //市
      [] //区
    ],
    displayPanel: false, //购买面板
    direct_buy: false, //直接购买
    count: 1 //购买数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          'gallery.width': window_width
        });
      }
    });

    //配送地址相关
    var province = wx.getStorageSync('province');
    var city = wx.getStorageSync('city');
    var district = wx.getStorageSync('district');
    var group = wx.getStorageSync('group');

    if (!province || !city || !district) {
      utils.request(config.service.address, { act: 'data', token: app.globalData.token }, 'GET', function (response) {
        province = response.data.province;
        city = response.data.city;
        district = response.data.district;
        group = response.data.group;

        regions.province = province;
        regions.city = city;
        regions.district = district;

        wx.setStorage({
          key: 'province',
          data: province
        });

        wx.setStorage({
          key: 'city',
          data: city
        });

        wx.setStorage({
          key: 'district',
          data: district
        });

        wx.setStorage({
          key: 'group',
          data: group
        });

        that.setData({
          'regions[0]': response.data.province
        });

        that.seekCity(regions.province[0].id);

        that.getDefaultAddress();
      });
    } else {
      regions.province = province;
      regions.city = city;
      regions.district = district;

      that.setData({
        'regions[0]': province
      });

      this.seekCity(regions.province[0].id);

      this.getDefaultAddress();
    }

    var data = {
      id: options.id || 0,
      act: 'show',
      token: app.globalData.token
    };

    utils.request(config.service.product, data, 'GET', function(response) {
      if(response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false,
          success: function() {
            wx.navigateBack();
          }
        });
      } else {
        that.setData({
          product: response.data.product,
          shop: response.data.shop,
          can_checkout: response.data.product.inventory >= 1
        });
        //产品详情
        WxParse.wxParse('product_detail', 'html', that.data.product.detail, that, 5);
        //包装售后
        WxParse.wxParse('product_after_sale', 'html', that.data.product.after_sale, that, 5);
        //替换当前页面标题啊
        wx.setNavigationBarTitle({
          title: response.data.product.name,
        });
      }
    });
  },

  /**
   * 产品收藏
   */
  collection: function() {
    var that = this;
    var data = {
      opera: 'collection',
      product_sn: this.data.product.product_sn,
      token: app.globalData.token
    };

    utils.request(config.service.product, data, 'POST', function(response) {
      if(response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      } else {
        that.setData({
          'product.collection': that.data.product.collection ^ true
        });
      }
    });
  },

  /**
   * 减少数量
   */
  countMinus: function () {
    var count = this.data.count;

    count = Math.min(count, this.data.product.inventory);

    if (count > 1) {
      count--;
    }

    this.setData({
      count: count
    });
  },

  /**
   * 数量增加
   */
  countPlus: function () {
    var count = this.data.count;

    count = Math.min(count, this.data.product.inventory);

    if (count < this.data.product.inventory) {
      count++;

    }

    this.setData({
      count: count
    });
  },

  /**
   * 输入数量
   */
  countInput: function (e) {
    var count = e.detail.value;
    count = parseInt(count);

    if (isNaN(count) || count <= 0) {
      count = 1;
    }
    count = Math.min(count, this.data.product.inventory);

    this.setData({
      count: count
    });
  },

  /**
   * 弹出购买层
   */
  showBuyPanel: function () {
    this.setData({
      displayPanel: true
    });
  },

  /**
   * 收起购买层
   */
  hideBuyPanel: function () {
    this.setData({
      displayPanel: false,
      direct: false
    });
  },

  /**
   * 加入购物车
   */
  addToCart: function() {
    this.setData({
      direct_buy: false,
      displayPanel: true
    });

    // this.buy();
  },

  /**
   * 直接购买
   */
  buyNow: function() {
    this.setData({
      direct_buy: true,
      displayPanel: true
    });

    // this.buy();
  },

  /**
   * 确定购买
   */
  buy: function () {
    var that = this;
    var data = {
      opera: 'add',
      product_id: this.data.product.id,
      count: this.data.count,
      token: app.globalData.token,
      direct: this.data.direct_buy
    };

    utils.request(config.service.cart, data, 'POST', function (response) {
      if (response.data.error != 0) {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });
      } else {
        if (data.direct) {
          //直接购买
          wx.navigateTo({
            url: '/pages/cart/checkout'
          });
        } else {
          //加入购物车
          wx.showModal({
            content: response.data.message,
            cancelText: '继续逛逛',
            confirmText: '购物车',
            success: function (e) {
              if (e.confirm) {
                wx.switchTab({
                  url: '/pages/cart/index'
                });
              }
            }
          });
        }
      }
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
    var share_info = {
      title: this.data.product.name,
      path: '/pages/product/detail?recommend=' + app.globalData.account + '&id=' + this.data.product.id,
      imageUrl: this.data.product.img
    };

    return share_info;
  },

  /*------------------------ 轮播图 -------------------------------*/
  //轮播图加载完毕
  galleryLoad: function (e) {
    //获得原始尺寸
    var width = e.detail.width;
    var height = e.detail.height;
    //宽高比
    var ratio = width / height;
    //计算图片缩放后高度并存入数组
    var heights = this.data.gallery.heights;
    heights.push(this.data.screen.width / ratio);

    this.setData({
      'gallery.heights': heights
    });
  },
  //轮播图切换
  galleryChange: function (target) {
    this.setData({
      'gallery.index': target.detail.current
    });
  },
  //轮播图点击
  galleryTap: function (e) {
    var index = this.data.gallery.index;
  },
  /*------------------------ 轮播图 End -------------------------------*/
  /*------------------------ tabs -------------------------------*/
  //点击切换面板
  tabSwitch: function (e) {
    this.setData({
      'tabs.current': e.currentTarget.dataset.id,
      'tabs.index': 'tab-' + e.currentTarget.dataset.id
    });
  },
  /*------------------------ tabs End -------------------------------*/
  /*------------------------ 客服电话 -------------------------------*/
  serviceCall: function (e) {
    console.info(e);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    });
  },
  /*------------------------ 客服电话 End -------------------------------*/
  /*------------------------ 地址选择 -------------------------------*/
  /**
   * 读取默认地址或初始化收货地址
   */
  getDefaultAddress: function() {
    var that = this;
    var default_region_index = [0, 0, 0];
    var default_region = ['北京', '北京', '海淀'];
    if (utils.checkAuthorization()) {
      utils.request(config.service.address, { act: 'get_default', token: app.globalData.token }, 'GET', function(response) {
        if(response.data.error == 0) {
          var i = 0;
          default_region_index[0] = that.seekProvince(response.data.address.province);
          default_region[0] = that.data.regions[0][default_region_index[0]].name;
          address.province = response.data.address.province;
          address.city = response.data.address.city;
          address.district = response.data.address.district;
          console.info(address);

          if (that.data.regions[1].length) {
            for (i = 0; i < that.data.regions[1].length; i++) {
              var city = that.data.regions[1][i];

              if (city.id == response.data.address.city) {
                default_region[1] = city.name;
                default_region_index[1] = i;
                that.seekDistrict(city.id);
                break;
              }
            }
          }

          if (that.data.regions[2].length) {
            for (i = 0; i < that.data.regions[2].length; i++) {
              var district = that.data.regions[2][i];

              if (district.id == response.data.address.district) {
                default_region[2] = district.name;
                default_region_index[2] = i;
                break;
              }
            }
          }

          console.info(default_region_index);
        }

        that.setData({
          region_index: default_region_index,
          region: default_region
        });

        that.checkDelivery();
      });
    } else {
      that.setData({
        region_index: default_region_index,
        region: default_region
      });
      that.checkDelivery();
    }
  },
  /**
   * 检查地址是否支持配送
   */
  checkDelivery: function() {
    var that = this;
    var data = {
      token: app.globalData.token,
      opera: 'delivery_check',
      province: address.province,
      city: address.city,
      district: address.district
    };

    utils.request(config.service.address, data, 'POST', function(response) {
      that.setData({
        support_delivery: response.data.error == 0
      });
    }, null, false);
  },

  /**
   * 查找省份
   */
  seekProvince: function (province_id) {
    var province = regions.province;
    if (province.length) {
      for (var i = 0; i < province.length; i++) {
        var province_item = province[i];

        if (province_item.id == province_id) {
          this.seekCity(province_id);
          console.info('seek ' + province_item.name + ' at ' + i);
          return i;
        }
      }
    }

    return 0;
  },
  /**
   * 查找城市
   */
  seekCity: function (province_id) {
    var city = regions.city;
    var city_result = [];

    if (city.length) {
      for (var i = 0; i < city.length; i++) {
        var city_item = city[i];

        if (city_item.province_id == province_id) {
          city_result.push(city_item);
        }
      }
    }

    this.setData({
      'regions[1]': city_result
    });

    if (regions.district.length) {
      this.seekDistrict(city_result[0].id);
    }
  },

  /**
   * 查找区
   */
  seekDistrict: function (city_id) {
    var district = regions.district;
    var district_result = [];

    if (district.length) {
      for (var i = 0; i < district.length; i++) {
        var district_item = district[i];

        if (district_item.city_id == city_id) {
          district_result.push(district_item);
        }
      }
    }

    this.setData({
      'regions[2]': district_result
    });
  },

  /**
   * 地区选择
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);


    for (var i = 0; i < e.detail.value.length; i++) {
      if (e.detail.value[i] == null) {
        e.detail.value[i] = 0;
      }
    }

    var province = this.data.regions[0][e.detail.value[0]];
    var city = this.data.regions[1][e.detail.value[1]];
    var district = this.data.regions[2][e.detail.value[2]];

    this.setData({
      region: [
        province.name,
        city.name,
        district.name
      ],
      region_index: e.detail.value
    });

    address.province = province.id;
    address.city = city.id;
    address.district = district.id;

    this.checkDelivery();
  },

  /**
   * 改变可选项
   */
  bindRegionColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        //选择省
        var province = this.data.regions[0][e.detail.value];
        this.seekCity(province.id);
        break;

      case 1:
        //选择市
        var city = this.data.regions[1][e.detail.value];
        this.seekDistrict(city.id);
        break;

      case 2:
        //选择区
        /*
        var district = this.data.regions[2][e.detail.value];
        this.seekGroup(district.id);
        */
        break;
    }
  },
  /*------------------------ 地址选择 End -------------------------------*/
});