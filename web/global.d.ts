type Omix<T = Record<string, any>> = T & Record<string, any>

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
