import type { Pinia } from 'pinia'
import type { Router, RouteLocationNormalized } from 'vue-router'
import type { PageLogger } from '../../plugins'

export interface ResultResolver<T = any> {
    data: T
    code: number
    message: string
    timestamp: string
}

export interface HttpServerConfig {
    logger: PageLogger
    pinia: Pinia
    route: RouteLocationNormalized
    router: Router
    request: { originalUrl?: string; headers?: Record<string, any> }
    env: ImportMetaEnv | NodeJS.ProcessEnv
}
