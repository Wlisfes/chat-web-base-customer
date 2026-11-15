import { toRefs, onMounted } from 'vue'
import { useState } from '@/hooks/modules/hook-state'
import { useProvider } from '@/hooks/modules/hook-provider'
import { API_BASE_URL, fetchDelay, fetchHandler } from '@/utils'

interface BaseServiceState {
    /**验证码接口地址**/
    url: string
    /**验证码接口地址参数组合**/
    link: string
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**加载失败状态**/
    error: boolean
}
/**hooks基本配置**/
interface BaseServiceOptions<T> extends Partial<BaseServiceState> {
    /**立即执行**/
    immediate?: boolean
    /**验证码主题**/
    inverse?: number
    /**额外数据**/
    options?: Omix<T>
}
export function useCodeService<T extends Omix>(options: BaseServiceOptions<T> = {}) {
    const { inverted } = useProvider()
    const { state, setState } = useState({
        url: options.url ?? `${API_BASE_URL}/api/auth/codex/write`,
        link: options.link ?? '',
        loading: options.loading ?? true,
        error: options.error ?? false,
        initialize: options.initialize ?? true,
        ...(options.options ?? {})
    } as BaseServiceState & typeof options.options)

    /**只在浏览器挂载后刷新，避免 SSR 直接请求验证码。*/
    onMounted(async () => {
        return await fetchHandler(options.immediate ?? true, async () => {
            return await fetchRefresh(0)
        })
    })

    /**验证码加载回调**/
    async function fetchComplete(delay: number = 100) {
        return await fetchDelay(delay).then(async () => {
            return await setState({ initialize: false, loading: false, error: false } as never)
        })
    }

    /**验证码加载失败回调**/
    async function fetchError(delay: number = 100) {
        return await fetchDelay(delay).then(async () => {
            return await setState({ initialize: false, loading: false, error: true } as never)
        })
    }

    /**刷新验证码**/
    async function fetchRefresh(delay: number = 300) {
        return await fetchDelay(delay).then(async () => {
            return await setState({
                loading: true,
                error: false,
                link: `${state.url}?inverse=${options.inverse ?? Number(inverted.value)}&timestamp=${Date.now()}`
            } as never)
        })
    }

    return {
        state,
        ...toRefs(state),
        setState,
        fetchRefresh,
        fetchComplete,
        fetchError
    }
}
