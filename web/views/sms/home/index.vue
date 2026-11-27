<script lang="tsx">
import { computed, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { ChartColumn, Document, FolderMoveTo, SendAlt, Time } from '@vicons/carbon'
import { maskPhone, SMS_STATUS_OPTIONS, useSmsSummary } from '@/views/sms/sms.data'

const trend = [
    { day: '11-15', value: 92, amount: '108,420' },
    { day: '11-16', value: 104, amount: '112,860' },
    { day: '11-17', value: 98, amount: '109,140' },
    { day: '11-18', value: 121, amount: '118,730' },
    { day: '11-19', value: 116, amount: '115,260' },
    { day: '11-20', value: 128, amount: '121,430' },
    { day: '11-21', value: 134, amount: '128,450' }
]

export default defineComponent({
    name: 'WebSmsHome',
    setup() {
        const router = useRouter()
        const { state, activeTasks, enabledApps, passedTemplates } = useSmsSummary()
        const scheduled = computed(() => state.tasks.filter(item => item.status === 'scheduled').length)
        const successRate = computed(() => {
            const total = state.records.length || 1
            return ((state.records.filter(item => item.status === 'success').length / total) * 100).toFixed(2)
        })
        const actions = [
            { title: '发送短信', document: '选择应用与已审核模板，立即或定时下发', path: '/web/sms/send', icon: SendAlt },
            { title: '新建模板', document: '配置验证码、通知或营销文案后提交审核', path: '/web/sms/template', icon: Document },
            { title: '上传号码文件', document: '导入 CSV / TXT / XLSX，自动去重校验号段', path: '/web/sms/file', icon: FolderMoveTo },
            { title: '查看统计', document: '对照送达率、类型分布和失败原因', path: '/web/sms/stat', icon: ChartColumn }
        ]

        function metric(label: string, value: string, extra: string, onClick?: () => void) {
            return (
                <common-base-element class="flex flex-col gap-y-6 p-inline-16 p-block-16" is-white is-border>
                    <n-text depth={3}>{label}</n-text>
                    <n-text class="text-28 line-height-34 font-600" depth={1}>
                        {value}
                    </n-text>
                    {onClick ? (
                        <n-button text type="primary" onClick={onClick}>
                            {extra}
                        </n-button>
                    ) : (
                        <n-text depth={3}>{extra}</n-text>
                    )}
                </common-base-element>
            )
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20 flex items-center justify-between gap-16" is-white>
                    <common-base-header
                        title="短信概览"
                        document={`${enabledApps.value.length} 个应用可用 · ${passedTemplates.value.length} 个模板已通过审核 · ${activeTasks.value} 个任务进行中`}
                    ></common-base-header>
                    <div class="flex items-center gap-10 shrink-0">
                        <common-base-button onClick={() => router.push('/web/sms/record')}>发送记录</common-base-button>
                        <common-base-button type="primary" onClick={() => router.push('/web/sms/send')}>
                            发送短信
                        </common-base-button>
                    </div>
                </common-base-element>

                <div class="grid grid-cols-4 gap-14 max-[1200px]:grid-cols-2 max-[720px]:grid-cols-1">
                    {metric('今日发送量', '128,450', '较昨日 +12.4%')}
                    {metric('发送成功率', `${successRate.value}%`, '样本来自最近回执')}
                    {metric('账户余额', `¥${state.amount.toLocaleString()}`, `余量 ${state.balance.toLocaleString()} 条`)}
                    {metric('待发送任务', String(scheduled.value), '查看队列', () => router.push('/web/sms/task'))}
                </div>

                <div class="grid grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] gap-14 max-[1100px]:grid-cols-1">
                    <common-base-element class="flex flex-col gap-16 p-inline-20 p-block-20" is-white is-border>
                        <div class="flex items-end justify-between gap-12">
                            <div class="flex flex-col gap-4">
                                <n-text class="text-16 line-height-24" depth={1}>
                                    近 7 天发送量
                                </n-text>
                                <n-text depth={3}>累计 814,290 条 · 日均到达率 99.38%</n-text>
                            </div>
                            <common-base-chunk type="success">通道正常</common-base-chunk>
                        </div>
                        <div class="flex items-end gap-12 h-180">
                            {trend.map(item => (
                                <div class="flex flex-1 flex-col items-center justify-end gap-8 min-w-0" key={item.day}>
                                    <n-text depth={3} class="text-12">
                                        {item.amount}
                                    </n-text>
                                    <i
                                        class="w-full max-w-36 rounded-t-3 bg-[var(--primary-color)]"
                                        style={{ height: item.value + 'px' }}
                                    ></i>
                                    <n-text depth={3}>{item.day}</n-text>
                                </div>
                            ))}
                        </div>
                    </common-base-element>
                    <common-base-element class="flex flex-col" is-white is-border>
                        <div class="p-inline-20 p-block-16" style={{ borderBottom: '1px solid var(--divider-color)' }}>
                            <n-text class="text-16 line-height-24" depth={1}>
                                快捷操作
                            </n-text>
                        </div>
                        {actions.map(item => (
                            <button
                                class="flex items-center gap-12 p-inline-20 p-block-14 text-left bg-transparent cursor-pointer"
                                style={{ borderBottom: '1px solid var(--divider-color)' }}
                                key={item.path}
                                onClick={() => router.push(item.path)}
                            >
                                <common-base-alert-wrapper class="p-8" type="info">
                                    <n-icon size={20} color="var(--n-icon-color)">
                                        {h(item.icon)}
                                    </n-icon>
                                </common-base-alert-wrapper>
                                <div class="flex flex-col flex-1 min-w-0">
                                    <n-text depth={1}>{item.title}</n-text>
                                    <n-ellipsis tooltip={false}>
                                        <n-text depth={3}>{item.document}</n-text>
                                    </n-ellipsis>
                                </div>
                            </button>
                        ))}
                    </common-base-element>
                </div>

                <common-base-element class="flex flex-col" is-white is-border>
                    <div
                        class="flex items-center justify-between gap-12 p-inline-20 p-block-16"
                        style={{ borderBottom: '1px solid var(--divider-color)' }}
                    >
                        <n-text class="text-16 line-height-24" depth={1}>
                            最近发送记录
                        </n-text>
                        <n-button text type="primary" onClick={() => router.push('/web/sms/record')}>
                            <n-icon class="m-ie-4" size={16}>
                                {h(Time)}
                            </n-icon>
                            查看全部
                        </n-button>
                    </div>
                    {state.records.slice(0, 5).map(item => (
                        <div
                            class="grid grid-cols-[140px_minmax(0,1.2fr)_minmax(0,1fr)_110px_168px] gap-12 items-center p-inline-20 p-block-12 max-[980px]:grid-cols-1"
                            key={item.keyId}
                            style={{ borderBottom: '1px solid var(--divider-color)' }}
                        >
                            <n-text depth={1}>{maskPhone(item.phone)}</n-text>
                            <n-ellipsis tooltip={false}>
                                <n-text depth={2}>{item.appName}</n-text>
                            </n-ellipsis>
                            <n-ellipsis tooltip={false}>
                                <n-text depth={2}>{item.templateName}</n-text>
                            </n-ellipsis>
                            <common-base-chunk value={item.status} items={SMS_STATUS_OPTIONS}></common-base-chunk>
                            <n-text depth={3}>{item.sendTime}</n-text>
                        </div>
                    ))}
                </common-base-element>
            </common-base-element>
        )
    }
})
</script>
