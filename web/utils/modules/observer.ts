type Handler = (event?: any) => void

/**与 mitt 相同的事件总线，不在 SSR 入口引入额外浏览器包。*/
export function Observer<T extends Record<string, any> = Record<string, any>>() {
    const handlers = new Map<keyof T | string, Set<Handler>>()
    return {
        on(type: keyof T | string, handler: Handler) {
            const set = handlers.get(type) ?? new Set<Handler>()
            set.add(handler)
            handlers.set(type, set)
        },
        off(type: keyof T | string, handler: Handler) {
            handlers.get(type)?.delete(handler)
        },
        emit(type: keyof T | string, event?: any) {
            handlers.get(type)?.forEach(handler => handler(event))
        }
    }
}

export const observer = Observer()