/* ************** 所有api的配置文档 ***************/
export const BASE_URL = 'http://mjwhqt.hjw988.com'// base url

/* ************** 后台接口 ***************/

export const GROUP_ADD = BASE_URL + '/admin/group/add' // 添加管理组
export const GROUP_UPDATE = BASE_URL + '/admin/group/update' // 修改管理组
export const GROUP_LIST = BASE_URL + '/admin/group/list' // 管理组列表
export const GROUP_DETAIL = BASE_URL + '/admin/group/detail' // 管理组详情
export const GROUP_DELETE = BASE_URL + '/admin/group/delete' // 删除管理组
export const ROULE_UPDATE = BASE_URL + '/admin/rule/update' // 设置权限
export const ROULE_DETAIL = BASE_URL + '/admin/rule/detail' // 获取权限
/* **** 资讯 **** */
export const INFO_ADD = BASE_URL + '/admin/info/add' // 资讯添加
export const INFO_UPDATE = BASE_URL + '/admin/info/update' // 资讯修改
export const INFO_LIST = BASE_URL + '/admin/info/list' // 资讯列表
export const INFO_DETAIL = BASE_URL + '/admin/info/detail' // 资讯详情
export const INFO_DELETE = BASE_URL + '/admin/info/delete' // 资讯删除
/* **** 商品 **** */
export const GOODS_ADD = BASE_URL + '/admin/goods/add' // 商品添加
export const GOODS_UPDATE = BASE_URL + '/admin/goods/update' // 商品修改
export const GOODS_LIST = BASE_URL + '/admin/goods/list' // 商品列表
export const GOODS_DETAIL = BASE_URL + '/admin/goods/detail' // 商品详情
export const GOODS_STATUS = BASE_URL + '/admin/goods/status' // 商品上架/下架
export const GOODS_TYPE = BASE_URL + '/admin/goods/type' // 商品推荐/不推荐的接口
export const GOODS_DELETE = BASE_URL + '/admin/goods/delete' // 商品删除
/* **** 留言管理 **** */
export const CANTACT_UPDATE = BASE_URL + '/admin/contact/update' // 留言管理处理
export const CANTACT_LIST = BASE_URL + '/admin/contact/list' // 留言管理列表
/* **** 分类 **** */
export const CATEGORY_ADD = BASE_URL + '/admin/category/add' // 分类添加
export const CATEGORY_UPDATE = BASE_URL + '/admin/category/update' // 分类修改
export const CATEGORY_LIST = BASE_URL + '/admin/category/list' // 分类列表
export const CATEGORY_DETAIL = BASE_URL + '/admin/category/detail' // 分类详情
export const CATEGORY_DELETE = BASE_URL + '/admin/category/delete' // 分类删除
/* **** 用户 **** */
export const USER_LIST = BASE_URL + '/admin/user/list' // 用户列表
export const USER_DETAIL = BASE_URL + '/admin/user/detail' // 用户详情
/* **** 订单 **** */
export const ORDER_UPDATE = BASE_URL + '/admin/order/update' // 订单发货
export const ORDER_LIST = BASE_URL + '/admin/order/list' // 订单列表
export const ORDER_SN = BASE_URL + '/admin/order/sn' // 订单号搜索
export const ORDER_SEARCH = BASE_URL + '/admin/order/search' // 订单检索
export const ORDER_DETAIL = BASE_URL + '/admin/order/detail' // 订单详情
/* **** 管理员 **** */
export const ADMIN_ADD = BASE_URL + '/admin/add' // 添加管理员
export const ADMIN_LOGIN = BASE_URL + '/admin/login' // 登录
export const ADMIN_LOGOUT = BASE_URL + '/admin/logout' // 登出
export const ADMIN_UPDATE = BASE_URL + '/admin/update' // 修改管理员
export const ADMIN_LIST = BASE_URL + '/admin/list' // 管理员列表
export const ADMIN_DETAIL = BASE_URL + '/admin/detail' // 管理员详情
export const ADMIN_FREEZE = BASE_URL + '/admin/freeze' // 冻结管理员
export const ADMIN_UNFREEZE = BASE_URL + '/admin/unfreeze' // 解冻管理员
export const ADMIN_DELETE = BASE_URL + '/admin/delete' // 删除管理员
/* **** banner **** */
export const BANNER_ADD = BASE_URL + '/admin/banner/add' // banner添加
export const BANNER_UPDATE = BASE_URL + '/admin/banner/update' // banner修改
export const BANNER_LIST = BASE_URL + '/admin/banner/list' // banner列表
export const BANNER_DETAIL = BASE_URL + '/admin/banner/detail' // banner详情
export const BANNER_DELETE = BASE_URL + '/admin/banner/delete' // banner删除

/* ******************** 通用接口 ******************* */
export const API_UPLOADS = BASE_URL + '/api/uploads' // 多图上传
export const API_UPLOAD = BASE_URL + '/api/upload' // 单图上传
