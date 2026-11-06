import { isPromise } from '@/utils'
import { createPageLogger, resolvePageLabel } from '@/plugins'
import { type HttpServerConfig } from '@/interface'
import { createAppServer } from '@/main'

const { app, router, pinia, fetchWinston } = createAppServer({ ssr: false })

if (window.__INITIAL_DATA__) {
    pinia.state.value = window.__INITIAL_DATA__
}

router.beforeResolve(async (to, from, next) => {
    if (from && !from.name) {
        return next()
    }

    const matched = router.resolve(to).matched
    const prevMatched = router.resolve(from).matched
    let diffed = false
    const activated = matched.filter((record, index) => diffed || (diffed = prevMatched[index] !== record))
    if (!activated.length) {
        return next()
    }

    const logger = fetchWinston()
    const config: HttpServerConfig = {
        logger,
        pinia,
        route: to,
        router,
        request: {},
        env: import.meta.env
    }
    await runHttpServer(matched, config)
    document.title = String(to.meta.title || import.meta.env.NODE_WEB_SEO_TITLE || '')
    return next()
})

router.isReady().then(() => {
    app.mount('#app')
})

async function runHttpServer(matched: typeof router.currentRoute.value.matched, config: HttpServerConfig) {
    const tasks = matched.flatMap(record => Object.values(record.components || {}))
    await Promise.all(
        tasks.map(component => {
            const page = component as {
                name?: string
                __name?: string
                __file?: string
                httpServer?: (config: HttpServerConfig) => unknown
            }
            const loader = page.httpServer
            if (!loader) {
                return Promise.resolve()
            }
            const result = loader({ ...config, logger: createPageLogger(resolvePageLabel(page), config.route.path) })
            return isPromise(result) ? result : Promise.resolve(result)
        })
    )
}
