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
    },
    {
        path: '/web/sms',
        redirect: '/web/sms/home',
        component: Layout,
        children: [
            {
                path: '/web/sms/home',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/app/index.vue')
            }
        ]
    },
    {
        path: '/web/voice',
        redirect: '/web/voice/home',
        component: Layout,
        children: [
            {
                path: '/web/voice/home',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/app/index.vue')
            }
        ]
    },
    {
        path: '/web/mail',
        redirect: '/web/mail/home',
        component: Layout,
        children: [
            {
                path: '/web/mail/home',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/app/index.vue')
            }
        ]
    },
    {
        path: '/web/whatsapp',
        redirect: '/web/whatsapp/home',
        component: Layout,
        children: [
            {
                path: '/web/whatsapp/home',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/app/index.vue')
            }
        ]
    }
]

export default webRoutes
