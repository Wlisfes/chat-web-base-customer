<script lang="tsx">
import { computed, defineComponent, reactive } from 'vue'
import { fetchNotifyService } from '@/plugins'
import { maskPhone, SMS_STATUS_OPTIONS, useSmsState } from '@/views/sms/sms.data'

export default defineComponent({
    name: 'WebSmsRecord',
    setup() {
        const state = useSmsState()
        const form = reactive({ phone: '', status: 'all', appName: 'all' })
        const apps = computed(() => [...new Set(state.records.map(item => item.appName))])
        const list = computed(() =>
            state.records.filter(
                item =>
                    (!form.phone || item.phone.includes(form.phone)) &&
                    (form.status === 'all' || item.status === form.status) &&
                    (form.appName === 'all' || item.appName === form.appName)
            )
        )
        const failed = computed(() => list.value.filter(item => item.status === 'failed').length)

        function exportRows() {
            const lines = [
                'phone,app,template,status,reason,sendTime',
                ...list.value.map(item => [item.phone, item.appName, item.templateName, item.status, item.reason ?? '', item.sendTime].join(','))
            ]
            const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '发送明细.csv'
            link.click()
            URL.revokeObjectURL(link.href)
            return fetchNotifyService({ type: 'success', title: '明细已导出', message: `${list.value.length} 条` })
        }

        function reset() {
            form.phone = ''
            form.status = 'all'
            form.appName = 'all'
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20 flex items-center justify-between gap-16" is-white>
                    <common-base-header title="发送记录" document="按手机号、应用和回执状态检索。失败原因会保留运营商回执码。"></common-base-header>
                    <common-base-button onClick={exportRows}>导出明细</common-base-button>
                </common-base-element>

                <div class="grid grid-cols-3 gap-14 max-[860px]:grid-cols-1">
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>当前结果</n-text>
                        <n-text class="text-24 font-600">{list.value.length}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>发送成功</n-text>
                        <n-text class="text-24 font-600">{list.value.filter(item => item.status === 'success').length}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>发送失败</n-text>
                        <n-text class="text-24 font-600">{failed.value}</n-text>
                    </common-base-element>
                </div>

                <common-base-element class="flex flex-col" is-white is-border>
                    <div
                        class="flex items-center gap-10 p-inline-16 p-block-12 flex-wrap"
                        style={{ borderBottom: '1px solid var(--divider-color)' }}
                    >
                        <n-input clearable placeholder="搜索手机号" v-model:value={form.phone} style={{ width: '220px' }}></n-input>
                        <n-select
                            v-model:value={form.appName}
                            style={{ width: '200px' }}
                            options={[{ label: '全部应用', value: 'all' }, ...apps.value.map(item => ({ label: item, value: item }))]}
                        ></n-select>
                        <n-select
                            v-model:value={form.status}
                            style={{ width: '160px' }}
                            options={[{ label: '全部状态', value: 'all' }, ...SMS_STATUS_OPTIONS.map(item => ({ label: item.label, value: item.value }))]}
                        ></n-select>
                        <n-button text onClick={reset}>
                            重置
                        </n-button>
                    </div>
                    <div
                        class="grid grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_110px_minmax(0,1.2fr)_168px] gap-12 p-inline-16 p-block-10 max-[1100px]:hidden"
                        style={{ borderBottom: '1px solid var(--divider-color)' }}
                    >
                        {['手机号', '所属应用', '模板', '状态', '失败原因', '发送时间'].map(item => (
                            <n-text depth={3} key={item}>
                                {item}
                            </n-text>
                        ))}
                    </div>
                    {list.value.length ? (
                        list.value.map(item => (
                            <div
                                class="grid grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_110px_minmax(0,1.2fr)_168px] gap-12 items-center p-inline-16 p-block-12 max-[1100px]:grid-cols-1"
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
                                <n-text depth={item.reason ? 1 : 3} type={item.reason ? 'error' : undefined}>
                                    {item.reason || '—'}
                                </n-text>
                                <n-text depth={3}>{item.sendTime}</n-text>
                            </div>
                        ))
                    ) : (
                        <div class="flex flex-col items-center justify-center gap-8 min-h-220">
                            <n-text depth={1}>没有匹配的发送记录</n-text>
                            <n-text depth={3}>放宽手机号、应用或状态条件后再试。</n-text>
                            <common-base-button onClick={reset}>重置筛选条件</common-base-button>
                        </div>
                    )}
                </common-base-element>
            </common-base-element>
        )
    }
})
</script>
