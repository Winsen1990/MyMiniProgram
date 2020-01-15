// pages/level/detail.js
'use strict';

var WxParse = require('../../assets/wxParse/wxParse');
var config = require('../../config');
var utils = require('../../utils/util');
var app = getApp();
var tabs = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level: null,
    user: {
      level_id: 1
    },
    tab: 0,
    arrow_left: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const query = wx.createSelectorQuery().in(that);

    //获取屏幕宽高  
    var res = wx.getSystemInfoSync();

    //用户状态
    if (app.globalData.userInfo) {
      that.setData({
        'user.level_id': getApp().globalData.userInfo.level_id
      });
    }

    var data = {
      id: options.id,
      act: 'detail'
    };

    //会员等级
    utils.request(config.service.level, data, 'GET', function (response) {
      if (response.data.error != 0) {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function () {
          wx.hideToast();
        }, 3000);
      } else {
        that.setData({
          level: response.data.level
        });

        for(var i = 0; i < response.data.level.privileges.length; i++) {
          WxParse.wxParse('level.privileges[' + i + '].richContent', 'html', response.data.level.privileges[i].content, that, 5);
        }

        wx.setNavigationBarTitle({
          title: '好当家会员·' + response.data.level.alias_name
        });

        that.setData({
          tab: options.tab
        });

        query.selectAll('.hdj-level-privilege-tab').boundingClientRect();
        query.exec(function (rects) {
          for (var i = 0; i < rects[0].length; i++) {
            console.info(rects[0][i]);
            tabs.push({
              id: rects[0][i].dataset.id,
              left: rects[0][i].left + (rects[0][i].width - 24/res.pixelRatio)/2
            });

            if (rects[0][i].dataset.id == options.tab) {
              that.setData({
                arrow_left: rects[0][i].left + (rects[0][i].width - 24/res.pixelRatio)/2
              });
            }
          }
        });
      };
    });
  },

  switchTab: function(e) {
    var id = e.currentTarget.dataset.id;

    for(var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];

      if(tab.id == id) {
        this.setData({
          tab: id,
          arrow_left: tab.left
        });
        console.info(tab);
        break;
      }
    }
  }
});