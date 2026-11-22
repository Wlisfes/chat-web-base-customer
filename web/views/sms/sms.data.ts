import { computed, reactive } from 'vue'

export type SmsSendStatus = 'success' | 'failed' | 'sending'
export type SmsAppStatus = 'enabled' | 'disabled'
export type SmsTemplateType = 'otp' | 'notify' | 'market'
export type SmsAuditStatus = 'passed' | 'pending' | 'rejected'
export type SmsFileStatus = 'ready' | 'parsing' | 'error'
export type SmsTaskStatus = 'sending' | 'done' | 'scheduled' | 'paused' | 'cancelled'

export interface SmsApp {
    keyId: number
    name: string
    appKey: string
    status: SmsAppStatus
    createTime: string
    signature: string
    templateCount: number
    todayCount: number
}

export interface SmsTemplate {
    keyId: number
    name: string
    templateId: string
    type: SmsTemplateType
    audit: SmsAuditStatus
    content: string
    variables: string[]
}

export interface SmsNumberFile {
    keyId: number
    name: string
    count: number
    uploadTime: string
    status: SmsFileStatus
    message?: string
}

export interface SmsTask {
    keyId: number
    name: string
    templateName: string
    total: number
    success: number
    failed: number
    progress: number
    status: SmsTaskStatus
    planTime?: string
    createTime: string
}

export interface SmsRecord {
    keyId: number
    phone: string
    appName: string
    templateName: string
    status: SmsSendStatus
    reason?: string
    sendTime: string
}

export const SMS_TYPE_OPTIONS = [
    { value: 'otp', label: '验证码' },
    { value: 'notify', label: '通知' },
    { value: 'market', label: '营销' }
]

export const SMS_STATUS_OPTIONS = [
    { value: 'success', label: '发送成功', type: 'success' },
    { value: 'sending', label: '发送中', type: 'warning' },
    { value: 'failed', label: '发送失败', type: 'error' }
]

const STATE_KEY = '__cloudsms_console_state__'

function nowText() {
    const date = new Date()
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function createState() {
    return reactive({
        balance: 256810,
        amount: 12840,
        apps: [
            {
                keyId: 1,
                name: '电商订单通知服务',
                appKey: 'ak_live_89f2c4a10b',
                status: 'enabled',
                createTime: '2026-08-14 10:22:05',
                signature: '云信电商',
                templateCount: 12,
                todayCount: 64210
            },
            {
                keyId: 2,
                name: '统一身份认证中心',
                appKey: 'ak_live_31e8b7d09c',
                status: 'enabled',
                createTime: '2026-07-02 15:08:41',
                signature: '云信安全',
                templateCount: 6,
                todayCount: 41890
            },
            {
                keyId: 3,
                name: '双十一大促营销',
                appKey: 'ak_live_74a1f9c52e',
                status: 'enabled',
                createTime: '2026-10-19 09:40:12',
                signature: '云信优选',
                templateCount: 8,
                todayCount: 15200
            },
            {
                keyId: 4,
                name: '物流轨迹推送',
                appKey: 'ak_live_52c0d3e81a',
                status: 'enabled',
                createTime: '2026-09-05 14:11:29',
                signature: '云信速运',
                templateCount: 5,
                todayCount: 5940
            },
            {
                keyId: 5,
                name: '企业内部告警系统',
                appKey: 'ak_live_19d4e8a67f',
                status: 'enabled',
                createTime: '2026-06-18 11:05:33',
                signature: '云信运维',
                templateCount: 4,
                todayCount: 1210
            },
            {
                keyId: 6,
                name: '旧版测试环境沙箱',
                appKey: 'ak_test_04b9f2c13d',
                status: 'disabled',
                createTime: '2026-03-11 16:48:00',
                signature: '云信测试',
                templateCount: 2,
                todayCount: 0
            }
        ] as SmsApp[],
        templates: [
            {
                keyId: 1,
                name: '登录动态验证码',
                templateId: 'SMS_20261001',
                type: 'otp',
                audit: 'passed',
                content: '【云信安全】您的登录验证码为 ${code}，5分钟内有效，请勿泄露给他人。',
                variables: ['code']
            },
            {
                keyId: 2,
                name: '订单支付成功确认',
                templateId: 'SMS_20261042',
                type: 'notify',
                audit: 'passed',
                content: '【云信电商】尊敬的 ${name}，您的订单 ${order_no} 已支付成功，我们将尽快为您安排发货。',
                variables: ['name', 'order_no']
            },
            {
                keyId: 3,
                name: '会员专享满减券通知',
                templateId: 'SMS_20261108',
                type: 'market',
                audit: 'passed',
                content: '【云信优选】${name}，会员专享满减券已到账，请在 ${expire} 前使用。',
                variables: ['name', 'expire']
            },
            {
                keyId: 4,
                name: '异地登录安全提醒',
                templateId: 'SMS_20260915',
                type: 'notify',
                audit: 'pending',
                content: '【云信安全】您的账号于 ${time} 在 ${city} 登录，如非本人操作请立即修改密码。',
                variables: ['time', 'city']
            },
            {
                keyId: 5,
                name: '周年庆限时秒杀预告',
                templateId: 'SMS_20261119',
                type: 'market',
                audit: 'rejected',
                content: '【云信优选】周年庆秒杀即将开始，点击 ${url} 领取优惠。',
                variables: ['url']
            },
            {
                keyId: 6,
                name: '包裹派送中提醒',
                templateId: 'SMS_20260821',
                type: 'notify',
                audit: 'passed',
                content: '【云信速运】您的包裹 ${waybill} 正在派送，预计 ${eta} 送达。',
                variables: ['waybill', 'eta']
            }
        ] as SmsTemplate[],
        files: [
            { keyId: 1, name: 'vip_members_202611.csv', count: 48520, uploadTime: '2026-11-21 14:20:11', status: 'ready' },
            { keyId: 2, name: 'active_users_shanghai.txt', count: 12300, uploadTime: '2026-11-20 19:05:44', status: 'ready' },
            { keyId: 3, name: 'cart_reminder_batch_09.xlsx', count: 8940, uploadTime: '2026-11-21 17:42:08', status: 'parsing' },
            {
                keyId: 4,
                name: 'legacy_export_broken.csv',
                count: 0,
                uploadTime: '2026-11-18 11:15:29',
                status: 'error',
                message: '编码格式错误'
            }
        ] as SmsNumberFile[],
        tasks: [
            {
                keyId: 1,
                name: 'VIP 会员双十一返场',
                templateName: '会员专享满减券通知',
                total: 48520,
                success: 31402,
                failed: 118,
                progress: 65,
                status: 'sending',
                createTime: '2026-11-21 17:30:00'
            },
            {
                keyId: 2,
                name: '华东物流签收提醒',
                templateName: '包裹派送中提醒',
                total: 12300,
                success: 12248,
                failed: 52,
                progress: 100,
                status: 'done',
                createTime: '2026-11-21 14:15:22'
            },
            {
                keyId: 3,
                name: '晚间购物车召回',
                templateName: '会员专享满减券通知',
                total: 8940,
                success: 0,
                failed: 0,
                progress: 0,
                status: 'scheduled',
                planTime: '20:00',
                createTime: '2026-11-21 16:40:05'
            }
        ] as SmsTask[],
        records: [
            {
                keyId: 1,
                phone: '13800138012',
                appName: '电商订单通知服务',
                templateName: '登录动态验证码',
                status: 'success',
                sendTime: '2026-11-21 17:58:04'
            },
            {
                keyId: 2,
                phone: '13912344421',
                appName: '统一身份认证中心',
                templateName: '异地登录安全提醒',
                status: 'success',
                sendTime: '2026-11-21 17:56:49'
            },
            {
                keyId: 3,
                phone: '18600219037',
                appName: '双十一大促营销',
                templateName: '会员专享满减券通知',
                status: 'sending',
                sendTime: '2026-11-21 17:55:12'
            },
            {
                keyId: 4,
                phone: '15021983304',
                appName: '物流轨迹推送',
                templateName: '包裹派送中提醒',
                status: 'failed',
                reason: '空号或停机 (DELIVRD_EMPTY)',
                sendTime: '2026-11-21 17:52:30'
            },
            {
                keyId: 5,
                phone: '17700006650',
                appName: '电商订单通知服务',
                templateName: '订单支付成功确认',
                status: 'success',
                sendTime: '2026-11-21 17:49:18'
            },
            {
                keyId: 6,
                phone: '13588412209',
                appName: '电商订单通知服务',
                templateName: '订单支付成功确认',
                status: 'failed',
                reason: '触发频控限制 (RATE_LIMIT)',
                sendTime: '2026-11-21 17:44:19'
            }
        ] as SmsRecord[],
        nextId: 100
    })
}

export function useSmsState() {
    if (typeof window === 'undefined') return createState()
    const holder = globalThis as typeof globalThis & { [STATE_KEY]?: ReturnType<typeof createState> }
    if (!holder[STATE_KEY]) holder[STATE_KEY] = createState()
    return holder[STATE_KEY]
}

export function useSmsSummary() {
    const state = useSmsState()
    const activeTasks = computed(() => state.tasks.filter(item => item.status === 'sending' || item.status === 'scheduled').length)
    const enabledApps = computed(() => state.apps.filter(item => item.status === 'enabled'))
    const passedTemplates = computed(() => state.templates.filter(item => item.audit === 'passed'))
    const readyFiles = computed(() => state.files.filter(item => item.status === 'ready'))
    return { state, activeTasks, enabledApps, passedTemplates, readyFiles }
}

export function maskPhone(phone: string) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function nextKey(state: ReturnType<typeof createState>) {
    state.nextId += 1
    return state.nextId
}

export function formatNow() {
    return nowText()
}

export function countPhones(text: string) {
    return text.split(/[^\d]+/).filter(item => /^1\d{10}$/.test(item))
}
