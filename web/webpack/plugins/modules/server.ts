import type { App } from 'vue'
import type { Request } from 'express'
import { fetchSetCoutext } from '../../hooks'

export function CoutextServer(ssr: boolean, request?: Request) {
    return {
        install(_app: App) {
            if (ssr && request) {
                fetchSetCoutext(request)
            }
        }
    }
}