import Cookies from 'universal-cookie'

const TOKEN = 'APP_NEST_TOKEN'
const TOKEN_EXPIRES = 'APP_NEST_TOKEN_EXPIRES'
const TOKEN_CREATED = 'APP_NEST_TOKEN_CREATED'

export interface SessionToken {
    accessToken: string
    expiresIn: number
}

export interface AccountProfile {
    accountType?: 'crm' | 'srm'
    keyId?: number
    name?: string
    alias?: string
    email?: string
    uid?: string
    avatar?: string
}

function jar(cookies?: Cookies) {
    return cookies ?? new Cookies()
}

function cookieOptions(expiresIn: number) {
    return { path: '/', maxAge: expiresIn }
}

/**读取不带 Bearer 前缀的访问令牌。*/
export function getAccessToken(cookies?: Cookies) {
    const token = jar(cookies).get(TOKEN)
    return token ? String(token).replace(/^Bearer\s+/i, '') : ''
}

/**保存登录会话，供请求拦截器判断是否需要续期。*/
export function fetchComposeSession(data: SessionToken, cookies?: Cookies) {
    const store = jar(cookies)
    const options = cookieOptions(data.expiresIn)
    store.set(TOKEN, `Bearer ${data.accessToken}`, options)
    store.set(TOKEN_EXPIRES, String(data.expiresIn), options)
    store.set(TOKEN_CREATED, String(Date.now()), options)
}

/**清理本地登录会话。*/
export function fetchDestroySession(cookies?: Cookies) {
    const store = jar(cookies)
    const options = { path: '/' }
    store.remove(TOKEN, options)
    store.remove(TOKEN_EXPIRES, options)
    store.remove(TOKEN_CREATED, options)
}

/**读取令牌有效期和签发时间。旧会话没有这两项时返回 0。*/
export function readSessionClock(cookies?: Cookies) {
    const store = jar(cookies)
    return {
        expires: Number(store.get(TOKEN_EXPIRES) || 0),
        created: Number(store.get(TOKEN_CREATED) || 0)
    }
}

/**登录响应里的客户资料补齐 uid，便于顶栏立即展示。*/
export function normalizeAccount(user?: AccountProfile) {
    if (!user) return {}
    return {
        ...user,
        uid: user.uid || (user.keyId != null ? String(user.keyId) : undefined)
    }
}
