export {}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        keywords?: string
        description?: string
        AUTH?: string
        /**是否显示控制台左侧菜单，默认显示**/
        sider?: boolean
    }
}