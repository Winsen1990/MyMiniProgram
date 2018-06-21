// pages/address/index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: [
      {
        consignee: '刘邦',//收货人
        mobile: '13900000000',//手机号码
        address: '广东省 深圳市 罗湖区 龙珠大道北121号',//详细地址
        id: 1,
        is_default: true
      },
      {
        consignee: '项羽',//收货人
        mobile: '13900000001',//手机号码
        address: '广东省 广州市 天河区 广园中路',//详细地址
        id: 2,
        is_default: false
      },
      {
        consignee: '胡亥',//收货人
        mobile: '13900000002',//手机号码
        address: '广东省 汕头市 澄海区 莲上镇',//详细地址
        id: 3,
        is_default: false
      }
    ]
  },

  /**
   * 设为默认地址
   */
  defaultAddress: function(e) {
    var that = this;
    console.info(e);
    var address_id = e.currentTarget.dataset.id;

    console.info(address_id);

    for (var i = 0; i < this.data.address.length; i++) {
      var address = this.data.address[i];

      if (address.id == address_id) {
        this.data.address[i].is_default = true;
      } else {
        this.data.address[i].is_default = false;
      }
    }

    this.setData({
      address: this.data.address
    });
  },

  /**
   * 删除地址
   */
  deleteAddress: function(e) {
    var that = this;
    console.info(e);
    var address_id = e.currentTarget.dataset.id;

    console.info(address_id);

    wx.showModal({
      title: '提示',
      content: '您确定要删除该地址？',
      showCancel: true,
      success: function(o) {
        console.info(o);
        if(o.confirm) {
          //提交删除地址
          wx.showToast({
            title: '删除成功',
          });

          that.renewData(address_id);
        }
      }
    });
  },

  /**
   * 从数据中剔除已删除的数据然后刷新
   */
  renewData: function(address_id) {
    for(var i = 0; i < this.data.address.length; i++) {
      var address = this.data.address[i];

      if(address.id == address_id) {
        this.data.address.splice(i, 1);
        if(address.is_default && this.data.address.length) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取地址列表
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