import { request } from '@/utils'

/**当前客户的短信应用静态枚举**/
export function httpBaseSmsAppEnums() {
    return request({
        url: '/api/sms/app/enums',
        method: 'GET'
    })
}

/**当前登录客户的短信应用分页列表。客户身份由 token 解析，不传 userKeyId。**/
export function httpBaseSmsColumnApp(data: Omix) {
    return request({
        url: '/api/sms/app/mine/column',
        method: 'POST',
        data
    })
}

/**当前登录客户新增短信应用。客户身份由 token 解析，不传 userKeyId。**/
export function httpBaseSmsCreateApp(data: Omix) {
    return request({
        url: '/api/sms/app/mine/create',
        method: 'POST',
        data
    })
}

/**当前登录客户更新自己的短信应用状态**/
export function httpBaseSmsUpdateApp(data: Omix) {
    return request({
        url: '/api/sms/app/mine/update',
        method: 'POST',
        data
    })
}
