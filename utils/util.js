const config = require('../config');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const strReplaceAll = (str, search, replace) => {
  if (str.indexOf(search) > -1) {
    return str.split(search).join(replace);
  }

  return str;
}

const emojis = [
  {name:'微笑', src: '00.gif'},
  {name:'撇嘴', src: '01.gif'},
  {name:'色', src: '02.gif'},
  {name:'发呆', src: '03.gif'},
  {name:'得意', src: '04.gif'},
  {name:'流泪', src: '05.gif'},
  {name:'害羞', src: '06.gif'},
  {name:'闭嘴', src: '07.gif'},
  {name:'睡', src: '08.gif'},
  {name:'大哭', src: '09.gif'},
  {name:'尴尬', src: '10.gif'},
  {name:'发怒', src: '11.gif'},
  {name:'调皮', src: '12.gif'},
  {name:'呲牙', src: '13.gif'},
  {name:'惊讶', src: '14.gif'},
  {name:'难过', src: '15.gif'},
  {name:'酷', src: '16.gif'},
  {name:'冷汗', src: '17.gif'},
  {name:'抓狂', src: '35.gif'},
  {name:'吐', src: '19.gif'},
  {name:'偷笑', src: '20.gif'},
  {name:'愉快', src: '21.gif'},
  {name:'白眼', src: '22.gif'},
  {name:'傲慢', src: '23.gif'},
  {name:'饥饿', src: '24.gif'},
  {name:'困', src: '25.gif'},
  {name:'惊恐', src: '26.gif'},
  {name:'流汗', src: '27.gif'},
  {name:'憨笑', src: '28.gif'},
  {name:'悠闲', src: '29.gif'},
  {name:'奋斗', src: '30.gif'},
  {name:'咒骂', src: '31.gif'},
  {name:'疑问', src: '32.gif'},
  {name:'嘘', src: '33.gif'},
  {name:'晕', src: '34.gif'},
  {name:'衰', src: '36.gif'},
  {name:'骷髅', src: '37.gif'},
  {name:'敲打', src: '38.gif'},
  {name:'再见', src: '39.gif'},
  {name:'擦汗', src: '40.gif'},
  {name:'抠鼻', src: '41.gif'},
  {name:'鼓掌', src: '42.gif'},
  {name:'坏笑', src: '44.gif'},
  {name:'左哼哼', src: '45.gif'},
  {name:'右哼哼', src: '46.gif'},
  {name:'哈欠', src: '47.gif'},
  {name:'鄙视', src: '48.gif'},
  {name:'委屈', src: '49.gif'},
  {name:'快哭了', src: '50.gif'},
  {name:'阴险', src: '51.gif'},
  {name:'亲亲', src: '52.gif'},
  {name:'可怜', src: '54.gif'},
  {name:'菜刀', src: '55.gif'},
  {name:'西瓜', src: '56.gif'},
  {name:'啤酒', src: '57.gif'},
  {name:'咖啡', src: '60.gif'},
  {name:'猪头', src: '62.gif'},
  {name:'玫瑰', src: '63.gif'},
  {name:'凋谢', src: '64.gif'},
  {name:'爱心', src: '66.gif'},
  {name:'心碎', src: '67.gif'},
  {name:'蛋糕', src: '68.gif'},
  {name:'炸弹', src: '70.gif'},
  {name:'便便', src: '74.gif'},
  {name:'月亮', src: '75.gif'},
  {name:'太阳', src: '76.gif'},
  {name:'拥抱', src: '78.gif'},
  {name:'强', src: '79.gif'},
  {name:'弱', src: '80.gif'},
  {name:'握手', src: '81.gif'},
  {name:'胜利', src: '82.gif'},
  {name:'抱拳', src: '83.gif'},
  {name:'勾引', src: '84.gif'},
  {name:'拳头', src: '85.gif'},
  {name:'OK', src: '89.gif'},
  {name:'跳跳', src: '92.gif'},
  {name:'发抖', src: '93.gif'},
  {name:'转圈', src: '95.gif'},
];

const emojiToImage = (str) => {
  var emoji_path = '../../assets/wxParse/emojis/';
  var emoji_regex = /\[([^\w]+)?\]/;

  if(emoji_regex.test(str)) {
    for(var i = 0; i < emojis.length; i++) {
      var emoji = emojis[i];
      str = strReplaceAll(str, '[' + emoji.name + ']', '<img src="' + emoji_path + emoji.src + '"/>');
    }
  }

  return str;
}

// 发起请求
const request = (url, data, method, success, fail, need_loading, loading_text) => {
  loading_text = loading_text || '';
  need_loading = need_loading == undefined ? true : need_loading;

  if(need_loading) {
    wx.showLoading({
      title: loading_text,
      mask: true
    });
  }

  var header = {};

  if (method == 'GET') {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
  }

  wx.request({
    url: url,
    data: data,
    method: method,
    success: success,
    header: header,
    fail: fail,
    complete: function () {
      if(need_loading) {
        wx.hideLoading();
      }
    }
  });
}

// 登录检查
const checkAuthorization = () => {
  var token = getApp().globalData.token;
  var expired = getApp().globalData.expired;

  if (!token) {
    return false;
  }

  /*
  if (expired < getTimestamp()) {
    return false;
  }
  */

  return true;
}

/**
   * 同步用户信息
   */
const syncUserInfo = function (res, callback) {
  var that = this;
  var app = getApp();
  wx.request({
    url: config.service.member,
    data: { res: res, nickname: res.userInfo.nickName, avatar: res.userInfo.avatarUrl, opera: 'sync', account: app.globalData.account, token: app.globalData.token },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (response) {
      console.info(response);
      if (!app.globalData.userInfo) {
        app.globalData.userInfo = {};
      }

      app.globalData.userInfo.nickname = res.userInfo.nickName;
      app.globalData.userInfo.avatar = res.userInfo.avatarUrl;

      if (typeof (callback) == 'function') {
        console.info('sync success call callback');
        callback();
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  emojis: emojis,
  strReplaceAll: strReplaceAll,
  emojiToImage: emojiToImage,
  request: request,
  checkAuthorization: checkAuthorization,
  syncUserInfo: syncUserInfo
}
