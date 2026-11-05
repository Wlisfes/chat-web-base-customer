import { renderToString } from 'vue/server-renderer'
import type { Request } from 'express'
import { isPromise } from '@webpack/utils'
import type { HttpServerConfig } from '@webpack/interface'
import { createAppServer } from '@/main'

export async function render(request: Request, manifest: Record<string, string[]>) {
    const { app, router, pinia, collect, fetchWinston } = createAppServer({ request, ssr: true })
    const logger = fetchWinston()

    await router.push(request.originalUrl)
    await router.isReady()

    const route = router.currentRoute.value
    const meta = route.meta
    meta.keywords = meta.keywords ?? process.env.NODE_WEB_SEO_KEYWORDS ?? ''
    meta.description = meta.description ?? process.env.NODE_WEB_SEO_DESCRIPTION ?? ''
    if (meta.title && process.env.NODE_WEB_SEO_TITLE) {
        meta.title = `${process.env.NODE_WEB_SEO_TITLE} - ${meta.title}`
    } else {
        meta.title = meta.title || process.env.NODE_WEB_SEO_TITLE || ''
    }

    const config: HttpServerConfig = {
        logger,
        pinia,
        route,
        router,
        request,
        env: process.env
    }
    await runHttpServer(route.matched, config)

    const renderCtx: { modules?: string[] } = {}
    const content = await renderToString(app, renderCtx)
    return {
        content,
        links: renderPreloadLinks(renderCtx.modules, manifest),
        meta,
        state: JSON.stringify(pinia.state.value).replace(/</g, '\\u003c'),
        css: collect()
    }
}

async function runHttpServer(matched: Array<{ components?: Record<string, any> | null }>, config: HttpServerConfig) {
    const tasks = matched.flatMap(record => Object.values(record.components || {}))
    await Promise.all(
        tasks.map(async component => {
            const resolved = component && typeof component.then === 'function' ? await component : component
            const loader = resolved?.httpServer || resolved?.default?.httpServer
            if (!loader) return
            const result = loader(config)
            if (isPromise(result)) await result
        })
    )
}

function renderPreloadLinks(modules: string[] | undefined, manifest: Record<string, string[]>) {
    if (!modules?.length) return ''
    const seen = new Set<string>()
    return modules
        .flatMap(id => manifest[id] || [])
        .filter(file => {
            if (seen.has(file)) return false
            seen.add(file)
            return true
        })
        .map(file => {
            if (file.endsWith('.js')) return `<link rel="modulepreload" crossorigin href="${file}">`
            if (file.endsWith('.css')) return `<link rel="stylesheet" href="${file}">`
            return ''
        })
        .join('')
}