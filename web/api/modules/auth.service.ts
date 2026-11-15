import type { ResultResolver } from '@/interface'
import { request, type AccountProfile, type SessionToken } from '@/utils'

/**账号登录**/
export function httpAuthAccountToken(data: Omix): Promise<ResultResolver<SessionToken & { user?: AccountProfile }>> {
    return request({
        url: '/api/auth/token/login',
        method: 'POST',
        data
    })
}

/**登录续时**/
export function httpAuthAccountTokenContinue(): Promise<ResultResolver<SessionToken>> {
    return request({
        url: '/api/auth/token/continue',
        method: 'POST'
    })
}

/**登录账户信息**/
export function httpAuthAccountTokenResolver(): Promise<ResultResolver<AccountProfile>> {
    return request({
        url: '/api/auth/token/resolve',
        method: 'GET'
    })
}

/**退出登录并撤销服务端会话**/
export function httpAuthAccountTokenLogout(): Promise<ResultResolver<Omix>> {
    return request({
        url: '/api/auth/token/logout',
        method: 'POST'
    })
}

/**客户注册并登录**/
export function httpAuthAccountTokenRegister(data: Omix): Promise<ResultResolver<SessionToken & { user?: AccountProfile }>> {
    return request({
        url: '/api/auth/token/crm/register',
        method: 'POST',
        data
    })
}
