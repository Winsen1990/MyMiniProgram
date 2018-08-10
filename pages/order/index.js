// pages/order/detail.js
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: 0, //订单状态
    size: 10,//每页数量
    order_list: [], //订单列表
    page: 1, //当前页码
    loading: false, //是否加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.status = options.status || 0;

    this.setData({
      status: that.data.status
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
    this.data.loading = true;

    var data = {
      act: 'view',
      page: this.data.page,
      status: this.data.status,
      token: getApp().globalData.token,
      size: this.data.size,
      has_next: false
    }

    util.request(config.service.order, data, 'GET', function(response) {
      if(response.data.error == 0) {
        that.setData({
          order_list: response.data.order_list
        });

        if(response.data.order_list.length >= that.data.size) {
          that.data.page++;
          that.data.has_next = true;
        } else {
          that.data.has_next = false;
        }
      } else {
        wx.showToast({
          title: response.data.message
        });
      }

      that.data.loading = false;
    });
  },

  /**
   * 
   */
  switchTab: function(e) {
    console.info(e);
    this.setData({
      status: e.currentTarget.dataset.status
    });

    this.onPullDownRefresh();
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
    var that = this;
    this.data.loading = true;

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    this.data.page = 1;

    var data = {
      act: 'view',
      page: this.data.page,
      status: this.data.status,
      token: getApp().globalData.token,
      size: this.data.size
    }
    
    wx.request({
      url: config.service.order,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (response) {
        if (response.data.error == 0) {
          that.setData({
            order_list: response.data.order_list
          });

          if (response.data.order_list.length >= that.data.size) {
            that.data.page++;
            that.data.has_next = true;
          } else {
            that.data.has_next = false;
          }
        } else {
          wx.showToast({
            title: response.data.message
          });
        }

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        that.data.loading = false;
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(!this.data.has_next) {
      return false;
    }
    this.data.loading = true;

    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    });
    
    var data = {
      act: 'view',
      page: this.data.page,
      status: this.data.status,
      token: getApp().globalData.token,
      size: this.data.size
    }

    wx.request({
      url: config.service.order,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (response) {
        if (response.data.error == 0) {
          for(var i = 0; i < response.data.order_list.length; i++) {
            that.data.order_list.push(response.data.order_list[i]);
          }

          that.setData({
            order_list: that.data.order_list
          });

          if (response.data.order_list.length >= that.data.size) {
            that.data.page++;
            that.data.has_next = true;
          } else {
            that.data.has_next = false;
          }
        } else {
          wx.showToast({
            title: response.data.message
          });
        }

        // 隐藏加载框
        wx.hideLoading();
      }
    });
  },

  cancelOrder: function(e) {
    var that = this;

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '您确定要取消该订单？',
      success: function(e) {
        console.info(e);

        if(e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'cancel',
          token: getApp().globalData.token
        };

        util.request(config.service.order, data, 'POST', function(response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function() {
              if(response.data.error == 0) {
                that.onPullDownRefresh();
              }
            }
          });
        });
      }
    });
  },

  receiveOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '您确定已收货？',
      success: function (e) {
        console.info(e);
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'receive',
          token: getApp().globalData.token
        };

        util.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.onPullDownRefresh();
              }
            }
          });
        });
      }
    });
  },

  rollbackOrder: function (e) {
    var that = this;
    console.info(e);

    var sn = e.currentTarget.dataset.sn;

    wx.showModal({
      title: '',
      content: '要申请退单？',
      success: function (e) {
        console.info(e);
        if (e.cancel) {
          return false;
        }

        var data = {
          sn: sn,
          opera: 'rollback',
          token: getApp().globalData.token
        };

        util.request(config.service.order, data, 'POST', function (response) {
          wx.showModal({
            title: '',
            content: response.data.message,
            showCancel: false,
            complete: function () {
              if (response.data.error == 0) {
                that.onPullDownRefresh();
              }
            }
          });
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})