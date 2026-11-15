import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/main-layout.vue'
import Layout from '@/layouts/layout.vue'

export const clientRoutes: Array<RouteRecordRaw> = [
    {
        path: '/main',
        name: MainLayout.name,
        component: MainLayout,
        children: [
            {
                path: '/main/login',
                meta: { AUTH: 'AUTH_NONE' },
                component: () => import('@/views/main/login/login.vue')
            },
            {
                path: '/main/register',
                meta: { AUTH: 'AUTH_NONE' },
                component: () => import('@/views/main/register/register.vue')
            },
            {
                path: '/main/:pathMatch(.*)*',
                meta: { AUTH: 'NONE' },
                component: () => import('@/views/error/404.vue')
            }
        ]
    },
    {
        path: '/',
        name: Layout.name,
        component: Layout,
        children: [
            {
                path: '/',
                meta: { AUTH: 'NONE' },
                name: 'Home',
                component: () => import('@/views/home/index.vue')
            },
            {
                path: '/:pathMatch(.*)*',
                meta: { AUTH: 'NONE' },
                component: () => import('@/views/error/404.vue')
            }
        ]
    }
]

export default clientRoutes
