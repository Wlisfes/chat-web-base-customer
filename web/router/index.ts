import { createRouter as _createRouter, createMemoryHistory, createWebHistory, type Router } from 'vue-router'
import { useGlobal, useStore, fetchConcat } from '@/store'
import { clientRoutes } from '@/router/modules/client'
import { webRoutes } from '@/router/modules/web'

/**路由配置**/
export const routes = fetchConcat(webRoutes, clientRoutes)
/**初始化路由实例**/
export function createRouter(options: Omix<{ ssr: boolean }>) {
    return _createRouter({
        history: options.ssr ? createMemoryHistory() : createWebHistory(),
        routes
    })
}

/**Pinia 安装后再绑定守卫，store 只取一次。**/
export function setupGuardRouter(router: Router) {
    const { fetchInitialize, loggedIn } = useStore(useGlobal)
    router.beforeEach(async to => {
        return await fetchInitialize().then(() => {
            if (to.meta.AUTH === 'AUTH' && !loggedIn.value && to.path !== '/main/login') {
                return { path: '/main/login', replace: true }
            }
            if (to.meta.AUTH === 'AUTH_NONE' && loggedIn.value && to.path !== '/web/home') {
                return { path: '/web/home', replace: true }
            }
        })
    })
}
