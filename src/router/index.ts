import {createRouter, createWebHashHistory} from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/user/Login.vue'),
        meta: {title: '用户登录'}
    }, {
        path: '/register',
        component: () => import('../views/user/Register.vue'),
        meta: {title: '用户注册'}
    }, {
        path: '/allstoreno',
        component: () => import('../views/store/AllStoreNo.vue'),
        meta: {title: '商品列表界面/主页'}
    }, {
        path: '/home',
        redirect: '/search',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/user/Dashboard.vue'),
                meta: {title: '个人信息'}
            },
            //以下为Lab2新增，添加了商店模块的界面，请大家自己添加商品模块的界面
            {
                path: '/allstore',
                name: 'allStore',
                component: () => import('../views/store/AllStore.vue'),
                meta: {title: '商品列表界面/主页'}
            },
            {
                path: '/storedetail/:storeId',
                name: 'storeDetail',
                component: () => import('../views/store/StoreDetail.vue'),
                meta: {title: '店铺详情'}
            },
            {
                path: '/storedetail/:storeId/productdetail/:productId',
                name: 'productDetail',
                component: () => import('../views/product/ProductDetail.vue'),
                meta: {title: '商品详情'}
            },
            {
                path: '/allorder',
                name: 'allOrder',
                component: () => import('../views/order/AllOrder.vue'),
                meta: {title: '订单列表'}
            },
            {
                path: '/orderdetail/:orderId',
                name: 'orderDetail',
                component: () => import('../views/order/OrderDetail.vue'),
                meta: {title: '订单详情'}
            },
            {
                path: '/allcoupon',
                name: 'allCoupon',
                component: () => import('../views/coupon/AllCoupon.vue'),
                meta: {title: '优惠券列表'}
            },
            {
                path: '/search',
                name: 'search',
                component: () => import('../views/search/Search.vue'),
                meta: {title: '搜索商品'}
            }
        ]
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }]
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role')

    if (to.meta.title) {
        document.title = to.meta.title
    }

    if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next()
            } else {
                next('/404')
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next()
        } else {
            next('/login')
        }
    }
})

export {router}
