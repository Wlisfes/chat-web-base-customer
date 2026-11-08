import { computed, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { useState, useCoutext } from '@/hooks'
import { httpAuthLogout, httpAuthResolve } from '@/api'
import { fetchComposeSession, fetchDestroySession, getAccessToken, normalizeAccount, type AccountProfile, type SessionToken } from '@/utils'

export const useGlobal = defineStore('APP_NEST_GLOBAL_STORE', () => {
    const { cookies } = useCoutext()
    const { state, setState } = useState({
        /**开启初始化**/
        initialize: true
    })
    const user = ref<AccountProfile>({})
    const loggedIn = computed(() => Boolean(getAccessToken(cookies) || user.value.uid || user.value.email))
    let loading: Promise<void> | undefined

    /**清理内存中的账户信息。*/
    function fetchResetUser() {
        user.value = {}
    }

    /**有本地令牌时拉取当前账户；公开页面失败只退出登录，不强制跳转。*/
    async function fetchInitialize() {
        if (!getAccessToken(cookies)) {
            fetchResetUser()
            return
        }
        if (user.value.uid || user.value.email) return
        if (loading) return loading
        loading = httpAuthResolve()
            .then(({ data }) => {
                user.value = normalizeAccount(data)
            })
            .catch(() => {
                fetchDestroySession(cookies)
                fetchResetUser()
            })
            .finally(() => {
                loading = undefined
            })
        return loading
    }

    /**登录或注册成功后写入会话，并立刻展示账户。*/
    async function fetchApplyLogin(data: SessionToken & { user?: AccountProfile }) {
        fetchComposeSession(data, cookies)
        if (data.user) {
            user.value = normalizeAccount(data.user)
            return
        }
        await fetchInitialize()
    }

    /**退出登录。服务端撤销失败时仍清理本地身份。*/
    async function fetchLogout() {
        try {
            await httpAuthLogout()
        } catch {
            // 本地会话必须清理，避免顶栏继续显示已失效账号。
        }
        fetchDestroySession(cookies)
        fetchResetUser()
    }

    return {
        ...toRefs(state),
        state,
        setState,
        user,
        loggedIn,
        fetchInitialize,
        fetchApplyLogin,
        fetchLogout,
        fetchResetUser
    }
})
