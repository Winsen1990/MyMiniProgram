// pages/home/index.js
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {
      avatar: '../../assets/user-unlogin.png',
      nickname: '登录',
      level: '普通客户'
    },
    login: false
  },

  building: () => {
    wx.showToast({
      title: '努力建设中',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!util.checkAuthorization()) {
      util.login(this.onLoad);
      return false;
    }

    if(getApp().globalData.userInfo && getApp().globalData.userInfo.nickname != '') {
      var user_info = getApp().globalData.userInfo;
      this.setData({
        login: true,
        user: {
          avatar: user_info.avatar,
          nickname: user_info.nickname
        }
      });
    }
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
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var that = this;
    wx.showToast({
      icon: 'loading',
    });
    console.info(e);

    wx.request({
      url: config.service.member,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { opera: 'sync', nickname: e.detail.userInfo.nickName, avatar: e.detail.userInfo.avatarUrl, sex: e.detail.userInfo.gender, token: getApp().globalData.token },
      success: function (response) {
        if (response.data.error != 0) {
          wx.showModal({
            title: '提示',
            content: response.data.message,
            showCancel: false
          });
        } else {
          getApp().globalData.userInfo = {
            nickname: e.detail.userInfo.nickName,
            sex: e.detail.userInfo.gender,
            avatar: e.detail.userInfo.avatarUrl
          };

          that.setData({
            login: true,
            user: {
              avatar: e.detail.userInfo.avatarUrl,
              nickname: e.detail.userInfo.nickName
            }
          });
        }
      },
      complete: function () {
        wx.hideToast();
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