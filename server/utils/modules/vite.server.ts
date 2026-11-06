import { createServer as createViteDevServer, type ViteDevServer } from 'vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

declare function __non_webpack_require__(id: string): any

export { ViteDevServer }

export interface EntryOptions {
    content: string
    links: string
    css: string
    state: string
    meta: {
        title?: string
        keywords?: string
        description?: string
    }
}

export interface ProductionWebServer {
    template: string
    manifest: Record<string, string[]>
    render: (request: any, manifest: Record<string, string[]>) => Promise<EntryOptions>
}

/**开发态 Vite，中间件模式，不自己托管 index.html。**/
export async function createServer(root: string) {
    return createViteDevServer({
        root,
        appType: 'custom',
        server: {
            middlewareMode: true,
            hmr: { port: 24681 }
        }
    })
}

/**生产态读取 Vite 构建产物。__non_webpack_require__ 避免 webpack 把运行时文件收进包内。**/
export function loadWebServer(): ProductionWebServer {
    const base = resolve(process.cwd(), 'build')
    const template = readFileSync(resolve(base, 'client/index.html'), 'utf-8')
    const manifest = JSON.parse(readFileSync(resolve(base, 'client/.vite/ssr-manifest.json'), 'utf-8'))
    const mod = __non_webpack_require__(resolve(base, 'server/entry-server.js'))
    return {
        template,
        manifest,
        render: mod.render || mod.default?.render
    }
}

export function fetchViteRender(html: string, opts: EntryOptions) {
    const style = `${opts.css ?? ''}${opts.links ?? ''}`
    return html
        .replace('<!--app-ssr-placeholder-->', opts.content ?? '')
        .replace('<!--app-ssr-title-->', opts.meta?.title ?? '')
        .replace('!--app-ssr-keywords--', opts.meta?.keywords ?? '')
        .replace('!--app-ssr-description--', opts.meta?.description ?? '')
        .replace("'<!--app--ssr-state-->'", opts.state ?? '{}')
        .replace('<!--app-ssr-style-->', style)
}