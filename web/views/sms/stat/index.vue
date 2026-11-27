<script lang="tsx">
import { computed, defineComponent, ref } from 'vue'
import { SMS_TYPE_OPTIONS, useSmsState } from '@/views/sms/sms.data'

const ranges = {
    '1d': { label: '今日', total: '128,450', delta: '较昨日 +12.4%', bars: [42, 56, 48, 62, 58, 71, 80] },
    '7d': { label: '近 7 天', total: '814,290', delta: '环比 +8.6%', bars: [92, 104, 98, 121, 116, 128, 134] },
    '30d': { label: '近 30 天', total: '3,246,180', delta: '环比 +5.1%', bars: [70, 82, 76, 96, 110, 104, 128] }
}

const failures = [
    ['空号或停机', 'DELIVRD_EMPTY', 2140, 43.8],
    ['运营商频控', 'RATE_LIMIT', 1120, 22.9],
    ['退订黑名单', 'BLACKLIST', 840, 17.2],
    ['关机或不在服务区', 'TIMEOUT', 512, 10.5],
    ['签名格式异常', 'SIGN_INVALID', 274, 5.6]
]

export default defineComponent({
    name: 'WebSmsStat',
    setup() {
        const state = useSmsState()
        const range = ref<keyof typeof ranges>('7d')
        const current = computed(() => ranges[range.value])
        const typeCounts = computed(() =>
            SMS_TYPE_OPTIONS.map((item, index) => ({
                ...item,
                count: [412, 286, 116][index]
            }))
        )
        const maxType = computed(() => Math.max(...typeCounts.value.map(item => item.count)))
        const appRows = computed(() =>
            state.apps
                .filter(item => item.status === 'enabled')
                .slice(0, 5)
                .map(item => ({ name: item.name, count: item.todayCount }))
        )
        const maxApp = computed(() => Math.max(...appRows.value.map(item => item.count), 1))

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20 flex items-center justify-between gap-16" is-white>
                    <common-base-header title="发送统计" document="对照送达率、模板类型和失败原因，定位通道与文案问题。"></common-base-header>
                    <n-radio-group v-model:value={range.value}>
                        <n-radio-button value="1d">今日</n-radio-button>
                        <n-radio-button value="7d">近 7 天</n-radio-button>
                        <n-radio-button value="30d">近 30 天</n-radio-button>
                    </n-radio-group>
                </common-base-element>

                <div class="grid grid-cols-4 gap-14 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
                    {[
                        ['发送总量', current.value.total, current.value.delta],
                        ['平均送达率', '99.42%', '失败 4,886 条'],
                        ['计费条数', '846,120', '含长短信拆分'],
                        ['活跃应用', String(state.apps.filter(item => item.status === 'enabled').length), '停用应用不计入']
                    ].map(item => (
                        <common-base-element class="flex flex-col gap-6 p-16" is-white is-border key={item[0]}>
                            <n-text depth={3}>{item[0]}</n-text>
                            <n-text class="text-26 font-600" depth={1}>
                                {item[1]}
                            </n-text>
                            <n-text depth={3}>{item[2]}</n-text>
                        </common-base-element>
                    ))}
                </div>

                <common-base-element class="flex flex-col gap-16 p-inline-20 p-block-20" is-white is-border>
                    <div class="flex items-end justify-between gap-12">
                        <div class="flex flex-col gap-4">
                            <n-text class="text-16" depth={1}>
                                {current.value.label}发送量
                            </n-text>
                            <n-text depth={3}>
                                总计 {current.value.total} 条 · {current.value.delta}
                            </n-text>
                        </div>
                        <common-base-chunk type="success">到达率稳定</common-base-chunk>
                    </div>
                    <div class="flex items-end gap-12 h-180">
                        {current.value.bars.map((value, index) => (
                            <div class="flex flex-1 flex-col items-center justify-end gap-8" key={index}>
                                <i class="w-full max-w-36 rounded-t-3 bg-[var(--primary-color)]" style={{ height: value + 'px' }}></i>
                                <n-text depth={3}>{range.value === '30d' ? `W${index + 1}` : `11-${15 + index}`}</n-text>
                            </div>
                        ))}
                    </div>
                </common-base-element>

                <div class="grid grid-cols-3 gap-14 max-[1100px]:grid-cols-1">
                    <common-base-element class="flex flex-col gap-12 p-16" is-white is-border>
                        <n-text class="text-16" depth={1}>
                            送达构成
                        </n-text>
                        <n-text class="text-32 font-600" type="primary">
                            99.4%
                        </n-text>
                        <n-progress type="line" percentage={99.4} show-indicator={false} height={8}></n-progress>
                        <common-base-columns-wrapper label-class="w-5em m-ie-10" label="发送成功">
                            809,404
                        </common-base-columns-wrapper>
                        <common-base-columns-wrapper label-class="w-5em m-ie-10" label="发送失败">
                            4,886
                        </common-base-columns-wrapper>
                    </common-base-element>
                    <common-base-element class="flex flex-col gap-12 p-16" is-white is-border>
                        <n-text class="text-16" depth={1}>
                            模板类型
                        </n-text>
                        {typeCounts.value.map(item => (
                            <div class="flex flex-col gap-6" key={item.value}>
                                <div class="flex items-center justify-between">
                                    <n-text depth={2}>{item.label}</n-text>
                                    <n-text depth={3}>{item.count}k</n-text>
                                </div>
                                <i
                                    class="h-6 rounded-3 bg-[var(--primary-color)]"
                                    style={{ width: Math.max(8, (item.count / maxType.value) * 100) + '%' }}
                                ></i>
                            </div>
                        ))}
                    </common-base-element>
                    <common-base-element class="flex flex-col gap-12 p-16" is-white is-border>
                        <n-text class="text-16" depth={1}>
                            应用今日发送
                        </n-text>
                        {appRows.value.map(item => (
                            <div class="flex flex-col gap-6" key={item.name}>
                                <div class="flex items-center justify-between gap-8">
                                    <n-ellipsis tooltip={false}>
                                        <n-text depth={2}>{item.name}</n-text>
                                    </n-ellipsis>
                                    <n-text depth={3}>{item.count.toLocaleString()}</n-text>
                                </div>
                                <i
                                    class="h-6 rounded-3 bg-[var(--primary-color)]"
                                    style={{ width: Math.max(8, (item.count / maxApp.value) * 100) + '%' }}
                                ></i>
                            </div>
                        ))}
                    </common-base-element>
                </div>

                <common-base-element class="flex flex-col" is-white is-border>
                    <div class="p-inline-16 p-block-14" style={{ borderBottom: '1px solid var(--divider-color)' }}>
                        <n-text class="text-16" depth={1}>
                            失败原因 Top 5
                        </n-text>
                    </div>
                    {failures.map((item, index) => (
                        <div
                            class="grid grid-cols-[36px_minmax(0,1fr)_160px_88px] gap-12 items-center p-inline-16 p-block-12 max-[760px]:grid-cols-[36px_minmax(0,1fr)]"
                            key={item[1]}
                            style={{ borderBottom: '1px solid var(--divider-color)' }}
                        >
                            <n-text depth={3}>{String(index + 1).padStart(2, '0')}</n-text>
                            <div class="flex flex-col gap-6 min-w-0">
                                <div class="flex items-center justify-between gap-8">
                                    <n-text depth={1}>{item[0]}</n-text>
                                    <n-text depth={3}>{item[1]}</n-text>
                                </div>
                                <i class="h-6 rounded-3 bg-[var(--error-color,#d03050)]" style={{ width: item[3] + '%' }}></i>
                            </div>
                            <n-text depth={2}>{Number(item[2]).toLocaleString()} 条</n-text>
                            <n-text depth={3}>{item[3]}%</n-text>
                        </div>
                    ))}
                </common-base-element>
            </common-base-element>
        )
    }
})
</script>
