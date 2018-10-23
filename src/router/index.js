import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    // 商品列表
                    path: '/goodslist',
                    component: resolve => require(['../components/page/goods/GoodsList.vue'], resolve),
                    meta: { title: '商品' }
                },
                {
                    // 创建商品
                    path: '/creategoods',
                    component: resolve => require(['../components/page/goods/CreateGoods.vue'], resolve),
                    meta: { title: '创建商品' }
                },
                {
                    // 资讯列表
                    path: '/infolist',
                    component: resolve => require(['../components/page/info/InfoList.vue'], resolve),
                    meta: { title: '资讯' }
                },
                {
                    // 增加资讯
                    path: '/addinfo',
                    component: resolve => require(['../components/page/info/AddInfo.vue'], resolve),
                    meta: { title: '增加资讯' }
                },
                {
                    // banner列表
                    path: '/bannerlist',
                    component: resolve => require(['../components/page/banner/BannerList.vue'], resolve),
                    meta: { title: 'banner' }
                },
                {
                    // 增加资讯
                    path: '/addbanner',
                    component: resolve => require(['../components/page/banner/AddBanner.vue'], resolve),
                    meta: { title: '增加banner' }
                },
                {
                    // 订单列表
                    path: '/orderlist',
                    component: resolve => require(['../components/page/order/OrderList.vue'], resolve),
                    meta: { title: '订单列表' }
                },
                {
                    // 订单详情
                    path: '/orderlistdetail',
                    component: resolve => require(['../components/page/order/ListDetail.vue'], resolve),
                    meta: { title: '订单详情' }
                },
                {
                    // 用户管理
                    path: '/userlist',
                    component: resolve => require(['../components/page/user/UserList.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    // 用户详情
                    path: '/userdetail',
                    component: resolve => require(['../components/page/user/UserDetail.vue'], resolve),
                    meta: { title: '用户详情' }
                },
                {
                    // 权限管理
                    path: '/groupmanage',
                    component: resolve => require(['../components/page/systemManage/GroupManage.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    // 权限管理
                    path: '/addgroup',
                    component: resolve => require(['../components/page/systemManage/AddGroup.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    //管理员管理
                    path: '/adminManage',
                    component: resolve => require(['../components/page/systemManage/AdminManage.vue'], resolve),
                    meta: { title: '管理员管理' }
                },
                {
                    // 增加管理员
                    path: '/addadmin',
                    component: resolve => require(['../components/page/systemManage/AddAdmin.vue'], resolve),
                    meta: { title: '增加admin' }
                },
                {
                    // 分类
                    path: '/categorylist',
                    component: resolve => require(['../components/page/category/CategoryList.vue'], resolve),
                    meta: { title: '分类管理' }
                },
                {
                    // 增加分类
                    path: '/addcategory',
                    component: resolve => require(['../components/page/category/AddCategory.vue'], resolve),
                    meta: { title: '增加分类' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
