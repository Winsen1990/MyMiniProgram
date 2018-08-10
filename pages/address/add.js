// pages/address/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consignee: '',//收货人
    mobile: '',//手机号码
    region: ['广东省', '广州市', '海珠区'],//省市区
    detail: '',//详细地址
    from_checkout: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.from_checkout = options.from_checkout || false;
  },

  /**
   * 信息校验
   */
  dataValidation: function(e) {
    var data = {};
    switch(e.currentTarget.dataset.name) {
      case 'consignee':
        data['consignee'] = e.detail.value;
        break;

      case 'mobile':
        data['mobile'] = e.detail.value;
        break;

      case 'detail':
        data['detail'] = e.detail.value;
        break;
    }

    this.setData(data);
  },

  /**
   * 地区选择
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 保存地址
   */
  saveAddress: function() {
    var that = this;
    wx.showToast({
      icon: 'loading'
    });

    var address = {
      id: 0,
      province: this.data.region[0],
      city: this.data.region[1],
      district: this.data.region[2],
      detail: this.data.detail,
      consignee: this.data.consignee,
      mobile: this.data.mobile
    };

    if(address.consignee == '') {
      wx.showToast({
        title: '请输入收货人姓名',
      });
      return false;
    }

    if(address.mobile == '') {
      wx.showToast({
        title: '请输入您的手机号码',
      });
    }

    if(address.province == '' || address.city == '' || address.district == '') {
      wx.showToast({
        title: '请选择省/市/区',
      });
      return false;
    }

    if(address.detail == '') {
      wx.showToast({
        title: '请输入路名门牌号',
      });
      return false;
    }

    //新增地址
    wx.request({
      url: config.service.address,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        province: that.data.region[0],
        city: that.data.region[1],
        district: that.data.region[2],
        address: that.data.detail,
        consignee: that.data.consignee,
        mobile: that.data.mobile,
        token: getApp().globalData.token,
        opera: 'add'
      },
      success: function(response) {
        if(response.data.error == 0) {
          wx.showModal({
            title: '',
            showCancel: false,
            content: '新增地址成功',
            complete: function() {
              if (that.data.from_checkout) {
                wx.setStorageSync('address', {
                  id: response.data.id,
                  detail: that.data.region[0] + ' ' + that.data.region[1] + ' ' + that.data.region[2] + ' ' + that.data.detail,
                  consignee: that.data.consignee,
                  mobile: that.data.mobile
                });
              }

              wx.navigateBack();
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false
          });
        }
      },
      complete: function() {
        wx.hideToast();
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
    wx.stopPullDownRefresh();
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