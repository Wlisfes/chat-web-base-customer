import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/web-layout.vue'

export const webRoutes: Array<RouteRecordRaw> = [
    {
        path: '/web',
        redirect: '/web/home',
        name: Layout.name,
        component: Layout,
        children: [
            {
                path: '/web/home',
                meta: { AUTH: 'AUTH', sider: false },
                component: () => import('@/views/main/home/index.vue')
            },
            {
                path: '/web/:pathMatch(.*)*',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/error/404.vue')
            }
        ]
    }
]

export default webRoutes
