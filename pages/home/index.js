//index.js
//获取应用实例
var utils = require('../../utils/util');
var config = require('../../config');
const app = getApp();

Page({
  data: {
    userInfo: {
      avatar: '../../assets/images/user-unlogin.png',
      nickname: '获取微信信息',
      level_id: 1,
      account: '',
      balance: 0,
      integral: 0,
      level_active_time: '',
      level_expired: '',
      level_name: '普通会员',
      mobile: null
    },
    min_grant_price: 999,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showBoard: false,
    qr_code: '',
    boardDraw: {},
    tmp_qr_code_path: ''
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        'userInfo.avatar': app.globalData.userInfo.avatar,
        'userInfo.nickname': app.globalData.userInfo.nickname,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          'userInfo.avatar': res.userInfo.avatarUrl,
          'userInfo.nickname': res.userInfo.nickName,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            'userInfo.avatar': res.userInfo.avatarUrl,
            'userInfo.nickname': res.userInfo.nickName,
            hasUserInfo: true
          });

          utils.syncUserInfo(res);
        }
      });
    }
  },
  onShow: function() {
    var that = this;
    var data = {
      act: 'show',
      token: getApp().globalData.token,
    };

    utils.request(config.service.member, data, 'GET', function (response) {
      if(response.data.error == 0) {
        that.setData({
          userInfo: response.data.member,
          banners: response.data.banners,
          min_grant_price: response.data.min_grant_price,
          hasUserInfo: true
        });
      }
    });
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var that = this;
    utils.syncUserInfo(e.detail, function () {
      that.onLoad();
    });
  },

  /**
   * 获取用户二维码
   */
  getMemberQrCode: function(e) {
    if(this.data.boardLoading) {
      return;
    }
    
    const that = this;
    this.setData({
      showBoard: true,
      boardLoading: true
    });

    if(this.data.qr_code !== '') {
      return;
    }

    var params = {
      token: app.globalData.token,
    };

    var board_draw = {
      width: '750rpx',
      height: '1135rpx',
      background: 'http://img.hdjshop.cn/image/board-bg.png',
      views: [
        {
          type: 'image',
          url: 'http://img.hdjshop.cn/image/board.jpg',
          css: {
            top: '32rpx',
            left: '30rpx',
            right: '32rpx',
            width: '688rpx',
            height: '347rpx',
            borderRadius: '16rpx 16rpx 0 0'
          },
        },
        {
          type: 'image',
          url: this.data.userInfo.avatar, //avatar
          css: {
            top: '404rpx',
            left: '328rpx',
            width: '100rpx',
            height: '100rpx',
            borderWidth: '6rpx',
            borderColor: '#FFF',
            borderRadius: '100rpx'
          }
        },
        {
          type: 'text',
          text: this.data.userInfo.nickname, //nickname
          css: {
            top: '532rpx',
            fontSize: '28rpx',
            left: '375rpx',
            align: 'center',
            color: '#3c3c3c'
          }
        },
        {
          type: 'text',
          text: `邀请您一起体验好物`,
          css: {
            top: '576rpx',
            left: '375rpx',
            align: 'center',
            fontSize: '28rpx',
            color: '#3c3c3c'
          }
        },
        {
          type: 'text',
          text: `好当家有机海参`,
          css: {
            top: '644rpx',
            left: '375rpx',
            maxLines: 1,
            align: 'center',
            fontWeight: 'bold',
            fontSize: '44rpx',
            color: '#3c3c3c'
          }
        },
        {
          type: 'image',
          url: '', //QRcode
          css: {
            top: '834rpx',
            left: '480rpx',
            width: '200rpx',
            height: '200rpx'
          }
        }
      ]
    };

    utils.request(config.service.qr_code, params, 'GET', function (response) {
      that.setData({
        boardLoading: false
      });

      if(response.data.error == 0) {
        // 保存base64图片到本地 获取本地临时文件路径
        const file_manager = wx.getFileSystemManager();
        console.info('get file manager', file_manager);
        const tmp_qr_code_path = wx.env.USER_DATA_PATH + '/' + that.data.userInfo.account + '_qrcode.png';
        if(file_manager.access(tmp_qr_code_path)) {
          file_manager.unlinkSync(tmp_qr_code_path);
        }

        const [, format, img] = /data:image\/(\w+);base64,(.*)/.exec(response.data.qr_code) || [];
        file_manager.writeFile({
          filePath: tmp_qr_code_path,
          data: img,
          encoding: 'base64',
          success: function(result) {
            console.info('write file success');
            console.info(result);

            if(result.errMsg === 'writeFile:ok') {
              console.info('set tmp qr code path', tmp_qr_code_path);
              board_draw.views[5].url = tmp_qr_code_path;

              that.setData({
                tmp_qr_code_path: tmp_qr_code_path,
                boardDraw: board_draw
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: response.data.message,
          icon: 'none'
        });

        setTimeout(function() {
          wx.hideToast();
        }, 3000);
      }
    });
  },

  /**
   * 保存二维码到本地
   */
  saveQrCode: function() {
    console.info('detect save qr code');
    const _this = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _this.saveImg();
            },
            fail() {
            // 如果用户拒绝过或没有授权，则再次打开授权窗口
            // （ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              wx.showModal({
                title: '获取权限失败',
                content: '是否打开设置页，允许小程序保存图片到你的相册',
                success: () => {
                  wx.openSetting({
                    success (sRes) {
                      if (sRes.authSetting['scope.writePhotosAlbum']) {
                        setTimeout(() => {
                          _this.saveImg();
                        }, 200);
                      }
                    },
                  });
                },
              });
            },
          });
        } else {
          // 有则直接保存
          _this.saveImg();
        }
      },
    });
  },

  saveImg: function() {
    const tempImgPath = this.data.qr_code;

    wx.showLoading({
      title: '正在保存中...', // 提示的内容,
      mask: true, // 显示透明蒙层，防止触摸穿透,
    });

    wx.saveImageToPhotosAlbum({
      filePath: tempImgPath,
      success() {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          mask: true,
        });
      },
      fail() {
        wx.showToast({
          title: '保存失败', 
          icon: 'none',
          duration: 2000,
          mask: true,
        });
      },
    });
  },

  qrCodeReady: function(e) {
    console.info('qr code reqdy', e);
    this.setData({
      qr_code: e.detail.path
    });
  },

  closeBoard: function() {
    this.setData({
      showBoard: false
    });
  },
});
