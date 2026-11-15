import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { clientRoutes } from '@/router/modules/client'
import { fetchConcat } from '@/utils'
import { useGlobal, useStore } from '@/store'

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