// pages/address/edit.js
var config = require('../../config');
var utils = require('../../utils/util');
const app = getApp();
var regions = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consignee: '',//收货人
    mobile: '',//手机号码
    region: ['', '', '', ''],//省市区
    region_index: [],
    regions: [
      [],
      [],
      [],
      []
    ],
    detail: '',//详细地址
    id: 0,
    can_submit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.id = options.id || 0;
    this.data.id = parseInt(this.data.id);

    if (isNaN(this.data.id) || this.data.id <= 0) {
      wx.showModal({
        title: '',
        content: '参数错误',
        showCancel: false,
        complete: function () {
          wx.navigateBack();
        }
      });
    }

    var province = wx.getStorageSync('province');
    var city = wx.getStorageSync('city');
    var district = wx.getStorageSync('district');
    var group = wx.getStorageSync('group');

    if (!province || !city || !district || !group) {
      utils.request(config.service.address, { act: 'data', token: app.globalData.token }, 'GET', function (response) {
        province = response.data.province;
        city = response.data.city;
        district = response.data.district;
        group = response.data.group;

        regions.province = province;
        regions.city = city;
        regions.district = district;
        regions.group = group;

        wx.setStorage({
          key: 'province',
          data: province
        });

        wx.setStorage({
          key: 'city',
          data: city
        });

        wx.setStorage({
          key: 'district',
          data: district
        });

        wx.setStorage({
          key: 'group',
          data: group
        });

        that.setData({
          'regions[0]': response.data.province
        });

        that.seekCity(regions.province[0].id);
        that.getAddress(that.data.id);
      });
    } else {
      regions.province = province;
      regions.city = city;
      regions.district = district;
      regions.group = group;

      that.setData({
        'regions[0]': province
      });

      this.seekCity(regions.province[0].id);
      this.getAddress(this.data.id);
    }
  },

  /**
   * 数据输入校验
   */
  validation: function (e) {
    console.info(e);
    var name = e.currentTarget.dataset.name;
    var value = e.detail.value;

    switch (name) {
      case 'consignee':
        this.setData({
          consignee: value
        });
        break;

      case 'mobile':
        this.setData({
          mobile: value
        });
        break;

      case 'detail':
        this.setData({
          detail: value
        });
        break;
    }

    //校验数据
    this.verify();
  },

  /**
   * 可提交检验
   */
  verify: function () {
    var can_submit = true;

    if (this.data.consignee == '') {
      can_submit = false;
    }

    if (this.data.mobile == '') {
      can_submit = false;
    }

    if (this.data.detail == '') {
      can_submit = false;
    }

    if (this.data.region_index.length == 0) {
      can_submit = false;
    }

    this.setData({
      can_submit: can_submit
    });
  },

  /**
   * 读取地址信息
   */
  getAddress: function (id) {
    var that = this;
    var data = { id: this.data.id, token: app.globalData.token, act: 'show' };

    utils.request(config.service.address, data, 'GET', function (response) {
      if (response.data.error == 0) {
        that.setData({
          consignee: response.data.address.consignee,//收货人
          mobile: response.data.address.mobile,//手机号码
          region: response.data.address.region,//省市区
          detail: response.data.address.detail,//详细地址
          'address.province': response.data.address.province,
          'address.city': response.data.address.city,
          'address.district': response.data.address.district,
          'address.group': response.data.address.group,
          id: data.id
        });

        var region_index = [0, 0, 0, 0];
        var i = 0;
        region_index[0] = that.seekProvince(response.data.address.province);
        console.info('complete init regions');
        console.info(that.data.regions);

        if (that.data.regions[1].length) {
          for (i = 0; i < that.data.regions[1].length; i++) {
            var city = that.data.regions[1][i];

            if (city.id == response.data.address.city) {
              console.info('find ' + city.name + ' at ' + i);
              region_index[1] = i;
              that.seekDistrict(city.id);
              break;
            }
          }
        }

        if (that.data.regions[2].length) {
          for (i = 0; i < that.data.regions[2].length; i++) {
            var district = that.data.regions[2][i];

            if (district.id == response.data.address.district) {
              console.info('find ' + district.name + ' at ' + i);
              region_index[2] = i;
              that.seekGroup(district.id);
              break;
            }
          }
        }

        if (that.data.regions[3].length) {
          for (i = 0; i < that.data.regions[3].length; i++) {
            var group = that.data.regions[3][i];

            if (group.id == response.data.address.group) {
              console.info('find ' + group.name + ' at ' + i);
              region_index[3] = i;
              break;
            }
          }
        }

        console.info(region_index);

        that.setData({
          region_index: region_index
        });
      }
    });
  },

  /**
   * 查找省份
   */
  seekProvince: function (province_id) {
    var province = regions.province;
    if (province.length) {
      for (var i = 0; i < province.length; i++) {
        var province_item = province[i];

        if (province_item.id == province_id) {
          this.seekCity(province_id);
          console.info('seek ' + province_item.name + ' at ' + i);
          return i;
        }
      }
    }

    return 0;
  },

  /**
   * 查找城市
   */
  seekCity: function (province_id) {
    var city = regions.city;
    var city_result = [];

    if (city.length) {
      for (var i = 0; i < city.length; i++) {
        var city_item = city[i];

        if (city_item.province_id == province_id) {
          city_result.push(city_item);
        }
      }
    }

    this.setData({
      'regions[1]': city_result
    });
    console.info('set city complete');

    if (regions.district.length) {
      this.seekDistrict(city_result[0].id);
    }
  },

  /**
   * 查找区
   */
  seekDistrict: function (city_id) {
    var district = regions.district;
    var district_result = [];

    if (district.length) {
      for (var i = 0; i < district.length; i++) {
        var district_item = district[i];

        if (district_item.city_id == city_id) {
          district_result.push(district_item);
        }
      }
    }

    this.setData({
      'regions[2]': district_result
    });
    console.info('set district complete');

    this.seekGroup(district_result[0].id);
  },

  /**
   * 查找商圈
   */
  seekGroup: function (district_id) {
    var group = regions.group;
    var group_result = [];

    if (group.length) {
      for (var i = 0; i < group.length; i++) {
        var group_item = group[i];

        if (group_item.district_id == district_id) {
          group_result.push(group_item);
        }
      }
    }

    this.setData({
      'regions[3]': group_result
    });

    console.info('set group complete');
  },

  /**
   * 地区选择
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    for (var i = 0; i < e.detail.value.length; i++) {
      if (e.detail.value[i] == null) {
        e.detail.value[i] = 0;
      }
    }

    var province = this.data.regions[0][e.detail.value[0]];
    var city = this.data.regions[1][e.detail.value[1]];
    var district = this.data.regions[2][e.detail.value[2]];
    var group = this.data.regions[3][e.detail.value[3]];

    this.setData({
      region: [
        province.name,
        city.name,
        district.name,
        group.name
      ],
      region_index: e.detail.value
    });
  },

  /**
   * 改变可选项
   */
  bindRegionColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        //选择省
        var province = this.data.regions[0][e.detail.value];
        this.seekCity(province.id);
        break;

      case 1:
        //选择市
        var city = this.data.regions[1][e.detail.value];
        this.seekDistrict(city.id);
        break;

      case 2:
        //选择区
        var district = this.data.regions[2][e.detail.value];
        this.seekGroup(district.id);
        break;
    }
  },

  /**
   * 保存地址
   */
  saveAddress: function () {
    var that = this;
    var address = {
      id: this.data.id,
      province: 0,
      city: 0,
      district: 0,
      group: 0,
      detail: this.data.detail,
      consignee: this.data.consignee,
      mobile: this.data.mobile
    };

    var province = this.data.regions[0][this.data.region_index[0]];
    var city = this.data.regions[1][this.data.region_index[1]];
    var district = this.data.regions[2][this.data.region_index[2]];
    var group = this.data.regions[3][this.data.region_index[3]];

    address.province = province ? province.id : 0;
    address.city = city ? city.id : 0;
    address.district = district ? district.id : 0;
    address.group = group ? group : 0;

    if (address.consignee == '') {
      wx.showToast({
        title: '请输入收货人姓名',
      });
      return false;
    }

    if (address.mobile == '') {
      wx.showToast({
        title: '请输入您的手机号码',
      });
      return false;
    }

    if (address.province == '' || address.city == '' || address.district == '') {
      wx.showToast({
        title: '请选择省/市/区',
      });
      return false;
    }

    if (address.detail == '') {
      wx.showToast({
        title: '请输入路名门牌号',
      });
      return false;
    }

    //提交修改
    var data = {
      province: province.id,
      city: city.id,
      district: district.id,
      group: group.id,
      address: that.data.detail,
      consignee: that.data.consignee,
      mobile: that.data.mobile,
      token: app.globalData.token,
      id: that.data.id,
      opera: 'edit'
    };

    utils.request(config.service.address, data, 'POST', function (response) {
      if (response.data.error == 0) {
        wx.showModal({
          title: '',
          content: response.data.message,
          showCancel: false,
          confirmText: '查看地址',
          complete: function () {
            wx.navigateBack();
          }
        });
      } else {
        wx.showModal({
          content: response.data.message,
          showCancel: false
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

  }
});