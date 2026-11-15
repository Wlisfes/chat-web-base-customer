import { VNode } from 'vue'
import { NotificationOptions, NotificationReactive } from 'naive-ui'
export interface BaseNotifyServiceOptions {
    /**弹窗类型**/
    type?: 'default' | 'info' | 'error' | 'success' | 'warning'
    /**开启主动关闭**/
    closable?: boolean
    /**提示标题文案**/
    title: string | VNode
    /**提示内容**/
    message?: string | VNode
    /**延迟关闭时间**/
    duration?: number
}

/**通知提示二次封装**/
export async function fetchNotifyService(opts: BaseNotifyServiceOptions): Promise<NotificationReactive | undefined> {
    if (typeof window === 'undefined' || !window.$notification) return
    return window.$notification.create({
        class: 'custom-notify-service',
        keepAliveOnHover: true,
        closable: opts.closable ?? true,
        type: opts.type ?? 'success',
        duration: opts.duration ?? 2500,
        content: function () {
            return (
                <div class="flex flex-col gap-5 flex-1 justify-center p-block-16">
                    <n-h4 class={{ 'm-0! line-height-24': true, 'p-ie-28': opts.closable ?? true }}>{opts.title}</n-h4>
                    {opts.message && <n-text depth="3">{opts.message}</n-text>}
                </div>
            )
        }
    } as NotificationOptions)
}
