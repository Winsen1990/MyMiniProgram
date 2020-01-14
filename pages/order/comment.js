// pages/order/comment.js
const config = require('../../config');
const utils = require('../../utils/util');
const app = getApp();

var comment_lang = {
  1: '理想和现实的差距哇',
  2: '有点瑕疵呀',
  3: '勉勉强强，可以接受',
  4: '虽然有点小瑕疵，还是挺不错的',
  5: '这款产品真的超赞的'
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: '',
    detail_id: 0,
    detail: {},
    comment_str: '这款产品真的超赞的',
    can_submit: false,
    star: 5,
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.sn == '' || options.id <= 0) {
      wx.showModal({
        content: '参数错误',
        showCancel: false,
        success: function () {
          wx.navigateBack();
        }
      });
    }

    var data = {
      token: app.globalData.token,
      order_sn: options.sn,
      id: options.id,
      act: 'detail'
    };

    utils.request(config.service.order, data, 'GET', function (response) {
      if (response.data.error == 0) {
        that.setData({
          order_sn: options.sn,
          detail_id: options.id,
          detail: response.data.detail
        });
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false,
          success: function () {
            wx.navigateBack();
          }
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
   * 选择星级
   */
  selectStar: function(e) {
    this.setData({
      star: e.currentTarget.dataset.num,
      comment_str: comment_lang[e.currentTarget.dataset.num]
    });
  },

  /**
   * 输入评价内容
   */
  commentInput: function(e) {
    this.setData({
      comment: e.detail.value,
      can_submit: e.detail.value.length >= 5
    });
  },

  /**
   * 提交评价
   */
  submitComment: function() {
    var data = {
      token: app.globalData.token,
      opera: 'product_comment',
      star: this.data.star,
      comment: this.data.comment,
      product_sn: this.data.detail.product_sn,
      detail_id: this.data.detail_id
    };

    //提交产品评价
    utils.request(config.service.order, data, 'POST', function(response) {
      wx.showModal({
        content: response.data.message,
        showCancel: false,
        success: function() {
          if(response.data.error == 0) {
            wx.navigateBack();
          }
        }
      })
    });

    //提交店铺评价
    this.submitShopComment(this.data.star);
  },

  /**
   * 提交店铺评价
   */
  submitShopComment: function(star) {
    var data = {
      token: app.globalData.token,
      order_sn: this.data.order_sn,
      star: star,
      opera: 'comment'
    };

    utils.request(config.service.order, data, 'POST');
  }
});