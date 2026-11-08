import { request } from '@/utils'

/** 管理端、CRM 客户或 SRM 供应商登录。accountType 为 crm 或 srm 时走客户登录。 */
export function httpAuthLogin(data: { accountType?: 'crm' | 'srm'; email?: string; account?: string; password: string; code: string }) {
    return request({
        url: '/api/auth/token/login',
        method: 'POST',
        data
    })
}

/** 登录续期。 */
export function httpAuthContinue() {
    return request({
        url: '/api/auth/token/continue',
        method: 'POST'
    })
}

/** 当前登录身份。 */
export function httpAuthResolve() {
    return request({
        url: '/api/auth/token/resolve',
        method: 'GET'
    })
}

/** 当前登录权限。客户账号返回空权限。 */
export function httpAuthPermissions() {
    return request({
        url: '/api/auth/permission/resolve',
        method: 'GET'
    })
}

/** 退出登录。 */
export function httpAuthLogout() {
    return request({
        url: '/api/auth/token/logout',
        method: 'POST'
    })
}

/** CRM 客户自助注册并登录。 */
export function httpAuthRegister(data: { nickname: string; email: string; password: string; code: string }) {
    return request({
        url: '/api/auth/token/crm/register',
        method: 'POST',
        data
    })
}
