// pages/address/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },

  /**
   * 设为默认地址
   */
  defaultAddress: function (e) {
    var that = this;
    console.info(e);
    var address_id = e.currentTarget.dataset.id;

    console.info(address_id);

    wx.showLoading({
      title: '正在设置默认地址...',
      mask: true
    });

    wx.request({
      url: config.service.address,
      method: 'POST',
      data: { opera: 'default', id: address_id, token: getApp().globalData.token },
      success: function (response) {
        if (response.data.error == 0) {
          wx.showToast({
            title: '默认地址设置成功',
          });

          for (var i = 0; i < that.data.address.length; i++) {
            var address = that.data.address[i];

            if (address.id == address_id) {
              that.data.address[i].is_default = true;
            } else {
              that.data.address[i].is_default = false;
            }
          }

          that.setData({
            address: that.data.address
          });
        } else {
          wx.showToast({
            title: response.data.message,
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },

  /**
   * 删除地址
   */
  deleteAddress: function (e) {
    var that = this;
    console.info(e);
    var address_id = e.currentTarget.dataset.id;

    console.info(address_id);

    wx.showModal({
      title: '提示',
      content: '您确定要删除该地址？',
      showCancel: true,
      success: function (o) {
        console.info(o);
        if (o.confirm) {
          //提交删除地址
          var data = { opera: 'delete', id: address_id, token: getApp().globalData.token };

          util.request(config.service.address, data, 'POST', function (response) {
            if (response.data.error == 0) {
              wx.showToast({
                title: '删除成功',
              });

              that.renewData(address_id);
            } else {
              wx.showToast({
                title: response.data.message,
              });
            }
          }, null, '正在删除地址...');
        }
      }
    });
  },

  /**
   * 从数据中剔除已删除的数据然后刷新
   */
  renewData: function (address_id) {
    for (var i = 0; i < this.data.address.length; i++) {
      var address = this.data.address[i];

      if (address.id == address_id) {
        this.data.address.splice(i, 1);
        if (address.is_default && this.data.address.length) {
          this.data.address[0].is_default = true;
        }
        break;
      }
    }

    this.setData({
      address: this.data.address
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 选中地址
   */
  selectAddress: function(e) {
    var selected_address = null;
    var address_id = e.currentTarget.dataset.id;

    for (var i = 0; i < this.data.address.length; i++) {
      if (address_id == this.data.address[i].id) {
        this.data.address[i].is_selected = true;
        selected_address = this.data.address[i];
      } else {
        this.data.address[i].is_selected = false;
      }
    }

    this.setData({
      address: this.data.address
    });

    wx.setStorage({
      key: 'address',
      data: {
        id: selected_address.id,
        detail: selected_address.address,
        consignee: selected_address.consignee,
        mobile: selected_address.mobile
      },
      success: function() {
        wx.navigateTo({
          url: '/pages/order/checkout',
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取地址列表
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = { act: 'view', token: getApp().globalData.token };
    util.request(config.service.address, data, 'GET', function (response) {
      if (response.data.error == 0) {
        var address = wx.getStorageSync('address');
        var address_list = response.data.address;

        if (address) {
          for (var i = 0; i < address_list.length; i++) {
            if (address.id == address_list[i].id) {
              address_list[i].is_selected = true;
            } else {
              address_list[i].is_selected = false;
            }
          }
        }

        that.setData({
          address: address_list
        });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})