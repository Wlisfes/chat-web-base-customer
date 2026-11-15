import { useMouse, useStore } from '@/store'

/**主题等全局能力，供布局组件按 manager 的 useProvider 调用。*/
export function useProvider() {
    return useStore(useMouse)
}