import { computed, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { useState, useCoutext, type AccountProfile, type SessionToken } from '@/hooks'
import { fetchComposeSession, fetchDestroySession, getAccessToken, isNotEmpty } from '@/utils'
import * as Service from '@/api'

export const useGlobal = defineStore('APP_NEST_GLOBAL_STORE', () => {
    const faseUser = ref<Omix<AccountProfile>>({})
    const { cookies } = useCoutext()
    const { state, setState } = useState({
        /**开启初始化**/
        initialize: true
    })

    /**清理内存中的账户信息。*/
    async function fetchUserUpdate(data: Omix = {}) {
        return (faseUser.value = data)
    }

    /**有本地令牌时拉取当前账户；公开页面失败只退出登录，不强制跳转。*/
    async function fetchInitialize() {
        if (!getAccessToken(cookies)) {
            return fetchUserUpdate()
        }
        if (isNotEmpty(faseUser.value.uid) || isNotEmpty(faseUser.value.email)) {
            return faseUser.value
        }
        try {
            return await Service.httpAuthAccountTokenResolver().then(async ({ data }) => {
                return await fetchUserUpdate(data)
            })
        } catch {
            return fetchDestroySession(cookies).then(() => {
                return fetchUserUpdate()
            })
        }
    }

    /**登录或注册成功后写入会话，并立刻展示账户。*/
    async function fetchApplyLogin(data: SessionToken & { user?: AccountProfile }) {
        return await fetchComposeSession(data, cookies).then(async () => {
            if (data.user) {
                return await fetchUserUpdate(data.user)
            }
            return await fetchInitialize()
        })
    }

    /**退出登录。服务端撤销失败时仍清理本地身份。*/
    async function fetchLogout() {
        try {
            return await Service.httpAuthAccountTokenLogout().then(async () => {
                return await Promise.all([fetchDestroySession(cookies), fetchUserUpdate()])
            })
        } catch {
            return fetchDestroySession(cookies).then(() => {
                return fetchUserUpdate()
            })
        }
    }

    return {
        ...toRefs(state),
        /**登录状态**/
        loggedIn: computed(() => {
            return Boolean(getAccessToken(cookies) || isNotEmpty(faseUser.value.uid) || isNotEmpty(faseUser.value.email))
        }),
        state,
        setState,
        faseUser,
        fetchInitialize,
        fetchApplyLogin,
        fetchLogout,
        fetchUserUpdate
    }
})
