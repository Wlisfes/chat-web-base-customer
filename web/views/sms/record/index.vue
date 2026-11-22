<script lang="tsx">
import { computed, defineComponent, reactive } from 'vue'
import { fetchNotifyService } from '@/plugins'
import { maskPhone, SMS_STATUS_OPTIONS, useSmsState } from '@/views/sms/sms.data'

export default defineComponent({
    name: 'WebSmsRecord',
    setup() {
        const state = useSmsState()
        const form = reactive({ phone: '', status: 'all', empty: false })
        const list = computed(() => {
            if (form.empty) return []
            return state.records.filter(item => (!form.phone || item.phone.includes(form.phone)) && (form.status === 'all' || item.status === form.status))
        })
        function exportRows() {
            const lines = ['phone,template,status,reason,sendTime', ...list.value.map(item => [item.phone, item.templateName, item.status, item.reason ?? '', item.sendTime].join(','))]
            const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '发送明细.csv'
            link.click()
            URL.revokeObjectURL(link.href)
            return fetchNotifyService({ type: 'success', title: '明细已导出' })
        }
        return () => (
            <div class="sms-page">
                <header class="sms-head"><div><h2>发送明细记录</h2><p>支持按手机号、模板及回执状态检索，并支持明细导出</p></div><n-button onClick={exportRows}>导出明细</n-button></header>
                <div class="sms-toolbar">
                    <n-input clearable placeholder="搜索手机号" v-model:value={form.phone} style={{ width: '220px' }} />
                    <n-select v-model:value={form.status} style={{ width: '160px' }} options={[{ label: '全部状态', value: 'all' }, ...SMS_STATUS_OPTIONS.map(item => ({ label: item.label, value: item.value }))]} />
                    <n-button quaternary onClick={() => (form.empty = !form.empty)}>{form.empty ? '恢复记录' : '切换空状态示例'}</n-button>
                </div>
                {list.value.length ? <n-data-table columns={[
                    { title: '手机号', key: 'phone', render: (row: Omix) => maskPhone(row.phone) },
                    { title: '模板', key: 'templateName' },
                    { title: '发送状态', key: 'status', render: (row: Omix) => <n-tag size="small" type={SMS_STATUS_OPTIONS.find(item => item.value === row.status)?.type}>{SMS_STATUS_OPTIONS.find(item => item.value === row.status)?.label}</n-tag> },
                    { title: '失败原因', key: 'reason', render: (row: Omix) => row.reason || '—' },
                    { title: '发送时间', key: 'sendTime' }
                ]} data={list.value} /> : <n-empty description="暂无匹配的发送记录"><n-button onClick={() => { form.phone = ''; form.status = 'all'; form.empty = false }}>重置筛选条件</n-button></n-empty>}
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-page { display: flex; flex-direction: column; gap: 16px; }
.sms-head { display: flex; justify-content: space-between; align-items: center; }
.sms-head h2 { margin: 0; }
.sms-head p { margin: 4px 0 0; color: var(--text-color-3); font-size: 13px; }
.sms-toolbar { display: flex; gap: 12px; }
</style>
