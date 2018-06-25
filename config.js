/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://api.buyauwines.com';
var api_path = '/api/v1';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        index: `${host}${api_path}/index.php`,//首页
        category: `${host}${api_path}/category.php`,//产品分类
        product: `${host}${api_path}/product.php`,//产品
        collection: `${host}${api_path}/collection.php`,//收藏
        address: `${host}${api_path}/address.php`,//地址
        order: `${host}${api_path}/order.php`,//订单
        cart: `${host}${api_path}/cart.php`,//购物车
        feed: `${host}${api_path}/feed.php`,//信息流
        // 登录地址，用于建立会话
        login: `${host}${api_path}/authorization.php`,//登录
        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;