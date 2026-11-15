//@ts-nocheck
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { fetchComposeSession, fetchDestroySession, getAccessToken, readSessionClock } from '@/utils/modules/session'
import { useCoutext } from '@/hooks/modules/hook-context'

const configuredApiBaseUrl = String(import.meta.env.NODE_WEB_API_BASEURL ?? '').trim()

/**开发环境走 SSR 同源 /api 代理，生产环境访问独立 API 域名。*/
export const API_BASE_URL = import.meta.env.DEV ? '' : configuredApiBaseUrl || 'https://chat-web.lisfes.cn'

export const request: AxiosRequest = axios.create({
    baseURL: API_BASE_URL,
    timeout: 90000,
    withCredentials: true
})


/**服务端没有 document.cookie，令牌要从当前请求的 Cookie 头读取。*/
function requestCookies() {
    return typeof window === 'undefined' ? useCoutext().cookies : undefined
}

function readAccessToken() {
    return getAccessToken(requestCookies())
}

function readRequestClock() {
    return readSessionClock(requestCookies())
}

/**服务端不能请求相对地址，直接打到 API 域名，避免回环把当前渲染卡住。*/
function serverBaseURL() {
    return configuredApiBaseUrl || 'https://chat-web.lisfes.cn'
}
const SKIP_CONTINUE = ['/api/auth/token/login', '/api/auth/token/continue', '/api/auth/token/crm/register', '/api/auth/codex/write']
let refreshing

/**剩余有效期大于 70% 时不续期，避免每次请求都打续期接口。*/
function shouldContinue(url = '') {
    if (!readAccessToken() || SKIP_CONTINUE.some(path => url.includes(path))) return false
    const { expires, created } = readRequestClock()
    if (!expires || !created) return true
    return (Date.now() - created) / 1000 >= expires * 0.3
}

async function resetAccount() {
    fetchDestroySession(requestCookies())
    if (typeof window === 'undefined') return
    const { useGlobal } = await import('@/store/modules/global')
    useGlobal().fetchUserUpdate()
}

async function renewToken() {
    const token = readAccessToken()
    const baseURL = typeof window === 'undefined' ? serverBaseURL() : API_BASE_URL
    const { data } = await axios.post(`${baseURL}/api/auth/token/continue`, null, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
    })
    if (data.code !== 200) throw data
    fetchComposeSession(data.data, requestCookies())
    return data.data.accessToken
}

async function ensureToken(url) {
    const token = readAccessToken()
    if (!shouldContinue(url)) return token
    if (!refreshing) {
        refreshing = renewToken()
            .catch(async error => {
                await resetAccount()
                throw error
            })
            .finally(() => {
                refreshing = undefined
            })
    }
    return refreshing
}

request.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (typeof window === 'undefined') config.baseURL = serverBaseURL()
        const token = await ensureToken(config.url)
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    error => Promise.reject(error)
)

request.interceptors.response.use(fetchInizeNotice, async error => {
    const data = error.response?.data
    if (data?.code === 401 || error.response?.status === 401) await resetAccount()
    return Promise.reject(data || error)
})

function fetchInizeNotice(response: AxiosResponse) {
    if (response.data.code === 401) {
        resetAccount()
        return Promise.reject(response.data)
    }
    if (response.data.code !== 200) {
        return Promise.reject(response.data)
    }
    return Promise.resolve(response.data)
}
