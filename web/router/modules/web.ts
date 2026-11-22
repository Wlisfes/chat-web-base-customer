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
                name: 'WebSmsHome',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/home/index.vue')
            },
            {
                path: '/web/sms/app',
                name: 'WebSmsApp',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/app/index.vue')
            },
            {
                path: '/web/sms/template',
                name: 'WebSmsTemplate',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/template/index.vue')
            },
            {
                path: '/web/sms/file',
                name: 'WebSmsFile',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/file/index.vue')
            },
            {
                path: '/web/sms/send',
                name: 'WebSmsSend',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/send/index.vue')
            },
            {
                path: '/web/sms/task',
                name: 'WebSmsTask',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/task/index.vue')
            },
            {
                path: '/web/sms/record',
                name: 'WebSmsRecord',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/record/index.vue')
            },
            {
                path: '/web/sms/stat',
                name: 'WebSmsStat',
                meta: { AUTH: 'AUTH' },
                component: () => import('@/views/sms/stat/index.vue')
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
                component: () => import('@/views/client/home/index.vue')
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
                component: () => import('@/views/client/home/index.vue')
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
                component: () => import('@/views/client/home/index.vue')
            }
        ]
    }
]

export default webRoutes
