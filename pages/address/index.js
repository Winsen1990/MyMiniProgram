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
        id: 1
      },
      {
        consignee: '项羽',//收货人
        mobile: '13900000001',//手机号码
        address: '广东省 广州市 天河区 广园中路',//详细地址
        id: 2
      },
      {
        consignee: '胡亥',//收货人
        mobile: '13900000002',//手机号码
        address: '广东省 汕头市 澄海区 莲上镇',//详细地址
        id: 3
      }
    ]
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