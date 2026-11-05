import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Request } from 'express'
import { ViteDevServer, createServer, fetchViteRender, loadWebServer } from '@server/utils'

let viteServer: ViteDevServer

export async function createViteServer() {
    if (!viteServer) {
        viteServer = await createServer('web')
    }
    return viteServer
}

export async function createRouteServer(request: Request) {
    if (process.env.NODE_ENV === 'production') {
        const webServer = await loadWebServer('web-client')
        const options = await webServer.render(request, webServer.manifest)
        return fetchViteRender(webServer.template, options)
    }

    const vite = await createViteServer()
    const html = readFileSync(resolve(process.cwd(), 'web/index.html'), 'utf-8')
    const element = await vite.transformIndexHtml(request.originalUrl, html)
    const loaded = await vite.ssrLoadModule('/entry-server.ts')
    const options = await loaded.render(request, {})
    return fetchViteRender(element, options)
}