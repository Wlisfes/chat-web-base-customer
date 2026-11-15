import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { useGlobal, useStore, fetchConcat } from '@/store'
import { clientRoutes } from '@/router/modules/client'
import { webRoutes } from '@/router/modules/web'

/**路由配置**/
export const routes = fetchConcat(clientRoutes)
/**初始化路由实例**/
export function createRouter(options: Omix<{ ssr: boolean }>) {
    const router = _createRouter({
        history: options.ssr ? createMemoryHistory() : createWebHistory(),
        routes
    })
    router.beforeEach(async () => {
        const { fetchInitialize } = useStore(useGlobal)
        await fetchInitialize()
    })
    return router
}
