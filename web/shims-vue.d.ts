declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

export {}

declare module 'vue' {
    interface ComponentCustomOptions {
        httpServer?(config: import('@/interface').HttpServerConfig): void | Promise<void>
    }
}
