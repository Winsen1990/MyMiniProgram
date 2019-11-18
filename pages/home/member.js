// pages/member/index.js

//获取应用实例
const app = getApp();
const utils = require('../../utils/util');
const config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [
      {
        'img': 'http://img.easyilife.com/image/platform/20191109/20191109093710_67818.png',
        'url': '#',
      },
      {
        'img': 'http://img.easyilife.com/image/platform/20191109/20191109093710_67818.png',
        'url': '#',
      }
    ],
    banner: {
      index: 0,
      heights: [],
      width: 0,
      autoplay: false,
      displayDots: false,
      duration: 800,
      interval: 5000
    },
    memberTypes: [],
    memberType: 0,
    memberName: '',
    memberPhone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var data = {
        'act': 'show',
        'token': getApp().globalData.token,
      };
    utils.request(config.service.member, data, 'GET', function (response) {
      console.log(response.data.memberTypes);
        that.setData({
          // 'banners': response.data.banners,
          'blocks': response.data.blocks,
          'memberTypes': response.data.memberTypes,
        })
      });
  },

  switchType: function (e) {
    this.setData({
      memberType: e.detail.value
    });
  },

  inputName: function(e) {
    this.setData({
      memberName: e.detail.value
    });
  },

  inputPhone: function (e) {
    this.setData({
      memberPhone: e.detail.value
    });
  },

  gainMember: function(e) {
    var data = {
      'opera': 'gain',
      'memberType': this.data.memberType,
      'memberName': this.data.memberName,
      'memberPhone': this.data.memberPhone,
      'token': getApp().globalData.token,
    };
    utils.request(config.service.member, data, 'POST', function (response) {
      if(response.data.error == 1) {
        wx.showToast({
          title: '支付成功',
        });


        wx.switchTab({
          url: '/pages/index/index2',
        });
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

  }
})