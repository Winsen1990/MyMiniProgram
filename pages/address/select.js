// pages/address/select.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresses: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 设为默认地址
   */
  defaultAddress: function (e) {
    var that = this;
    console.info(e);
    var address_id = e.detail.value;

    console.info(address_id);

    var data = {
      opera: 'default',
      id: address_id,
      token: app.globalData.token
    };

    utils.request(config.service.address, data, 'POST', function (response) {
      if (response.data.error == 0) {
        wx.showModal({
          content: '设置成功',
          showCancel: false
        });

        for (var i = 0; i < that.data.addresses.length; i++) {
          var address = that.data.addresses[i];

          if (address.id == address_id) {
            that.data.addresses[i].is_default = true;
          } else {
            that.data.addresses[i].is_default = false;
          }
        }

        that.setData({
          addresses: that.data.addresses
        });
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false
        });

        that.setData({
          addresses: that.data.addresses
        });
      }
    }, null, true, '正在设置默认地址');
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
          var data = { opera: 'delete', id: address_id, token: app.globalData.token };

          utils.request(config.service.address, data, 'POST', function (response) {
            if (response.data.error == 0) {

              wx.showModal({
                title: '',
                content: '删除成功',
                showCancel: false,
                success: function () {
                  that.onShow();
                }
              });

              var selected_address = wx.getStorageSync('address');
              if (selected_address && selected_address.id == address_id) {
                wx.removeStorageSync('address');
              }
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
   * 选中地址
   */
  selectAddress: function (e) {
    console.info('trigger select address');
    var selected_address = null;
    var address_id = e.detail.value;

    for (var i = 0; i < this.data.addresses.length; i++) {
      if (address_id == this.data.addresses[i].id) {
        this.data.addresses[i].selected = true;
        selected_address = this.data.addresses[i];
      } else {
        this.data.addresses[i].selected = false;
      }
    }

    this.setData({
      addresses: this.data.addresses
    });

    wx.setStorage({
      key: 'address',
      data: {
        id: selected_address.id,
        detail: selected_address.address,
        consignee: selected_address.consignee,
        mobile: selected_address.mobile
      },
      success: function () {
        wx.navigateBack();
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
    var that = this;
    var data = { act: 'view', token: app.globalData.token };
    utils.request(config.service.address, data, 'GET', function (response) {
      if (response.data.error == 0) {
        var address = wx.getStorageSync('address');
        var address_list = response.data.addresses;

        if (address) {
          for (var i = 0; i < address_list.length; i++) {
            if (address.id == address_list[i].id) {
              address_list[i].selected = true;
            } else {
              address_list[i].selected = false;
            }
          }
        }

        that.setData({
          addresses: address_list
        });
      } else {
        wx.showToast({
          title: response.data.message
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

  }
});