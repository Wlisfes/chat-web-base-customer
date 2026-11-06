import { readFileSync, statSync } from 'fs'
import { resolve } from 'path'
import { Request } from 'express'
import { ViteDevServer, createServer, fetchViteRender, loadWebServer } from '@server/utils'

let viteServer: ViteDevServer
let entryStamp = 0

export async function createViteServer() {
    if (!viteServer) {
        viteServer = await createServer('web')
    }
    return viteServer
}

/**web 改动不会触发 Nest 重启，按文件时间清掉 Vite SSR 缓存。**/
async function loadEntryServer(vite: ViteDevServer) {
    const files = ['web/entry-server.ts', 'web/entry-client.ts', 'web/plugins/modules/logger.ts']
    const stamp = files.reduce((total, file) => total + statSync(resolve(process.cwd(), file)).mtimeMs, 0)
    if (stamp !== entryStamp) {
        const urls = ['/entry-server.ts', '/entry-client.ts', '/plugins/index.ts', '/plugins/modules/logger.ts']
        await Promise.all(
            urls.map(async url => {
                const mod = await vite.moduleGraph.getModuleByUrl(url)
                if (mod) vite.moduleGraph.invalidateModule(mod)
            })
        )
        entryStamp = stamp
    }
    return vite.ssrLoadModule('/entry-server.ts')
}

export async function createRouteServer(request: Request) {
    if (process.env.NODE_ENV === 'production') {
        const webServer = await loadWebServer()
        const options = await webServer.render(request, webServer.manifest)
        return fetchViteRender(webServer.template, options)
    }

    const vite = await createViteServer()
    const html = readFileSync(resolve(process.cwd(), 'web/index.html'), 'utf-8')
    const element = await vite.transformIndexHtml('/index.html', html)
    const loaded = await loadEntryServer(vite)
    const options = await loaded.render(request, {})
    return fetchViteRender(element, options)
}
