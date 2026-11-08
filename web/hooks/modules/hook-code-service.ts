import { onMounted, toRefs } from 'vue'
import { useMouse, useStore } from '@/store'
import { useState } from '@/hooks/modules/hook-state'
import { API_BASE_URL, fetchDelay } from '@/utils'

interface CodeServiceState {
    url: string
    link: string
    initialize: boolean
    loading: boolean
    error: boolean
}

/** 图形验证码只在浏览器挂载后刷新，避免 SSR 直接请求接口。 */
export function useCodeService(url = `${API_BASE_URL}/api/auth/codex/write`) {
    const { inverted } = useStore(useMouse)
    const { state, setState } = useState<CodeServiceState>({
        url,
        link: '',
        loading: true,
        error: false,
        initialize: true
    })

    onMounted(() => {
        fetchRefresh(0)
    })

    async function fetchComplete(delay = 100) {
        return fetchDelay(delay).then(() => setState({ initialize: false, loading: false, error: false }))
    }

    async function fetchError(delay = 100) {
        return fetchDelay(delay).then(() => setState({ initialize: false, loading: false, error: true }))
    }

    async function fetchRefresh(delay = 300) {
        return fetchDelay(delay).then(() =>
            setState({
                loading: true,
                error: false,
                link: `${state.url}?inverse=${Number(inverted.value)}&timestamp=${Date.now()}`
            })
        )
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
