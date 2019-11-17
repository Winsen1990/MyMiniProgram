/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://api.hdjshop.cn';
var api_path = '/v1';

var config = {
  service: {
    host,
    index: `${host}${api_path}/index.php`,//首页
    category: `${host}${api_path}/category.php`,//产品分类
    product: `${host}${api_path}/product.php`,//产品
    address: `${host}${api_path}/address.php`,//地址
    order: `${host}${api_path}/order.php`,//订单
    cart: `${host}${api_path}/cart.php`,//购物车
    checkout: `${host}${api_path}/checkout.php`,//下单页面
    member: `${host}${api_path}/member.php`,//用户信息
    comment: `${host}${api_path}/comment.php`,//评论
    feed: `${host}${api_path}/feed.php`,//资讯
    content_comment: `${host}${api_path}/content_comment.php`,//资讯评论
    keywords: `${host}${api_path}/keywords.php`,//热搜关键词
    exam: `${host}${api_path}/question.php`,//问卷
    // 登录地址，用于建立会话
    login: `${host}${api_path}/authorization.php`//登录
  }
};

module.exports = config;