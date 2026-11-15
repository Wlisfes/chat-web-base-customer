import { useThemeVars } from 'naive-ui'
import { useMouse, useStore } from '@/store'

/**主题等全局能力。配色来自 customer 的 useMouse，返回字段与 manager 的 useProvider 对齐。*/
export function useProvider() {
    const store = useStore(useMouse)
    const vars = useThemeVars()
    return { ...store, vars }
}