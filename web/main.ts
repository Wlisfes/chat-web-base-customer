import '@/styles/index.scss'
import 'uno.css'
import { createSSRApp, type App as VueApp } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import { setup } from '@css-render/vue3-ssr'
import type { Request } from 'express'
import type { Router } from 'vue-router'
import { createRouter } from '@/router'
import { i18n } from '@/i18n'
import { CoutextServer, createPageLogger } from '@/plugins'
import App from '@/App.vue'

export interface AppOptions {
    ssr: boolean
    request?: Request
}

export interface AppServer {
    app: VueApp
    router: Router
    pinia: Pinia
    collect: () => string
    fetchWinston: () => ReturnType<typeof createPageLogger>
}

export function createAppServer(options: AppOptions): AppServer {
    const app = createSSRApp(App)
    const router = createRouter(options)
    const pinia = createPinia()
    const { collect } = setup(app)

    app.use(CoutextServer(options.ssr, options.request))
    app.use(pinia)
    app.use(router)
    app.use(i18n)

    return {
        app,
        router,
        pinia,
        collect,
        fetchWinston: () => createPageLogger('web-client')
    }
}