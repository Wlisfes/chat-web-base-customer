<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchNotifyService } from '@/plugins'
import { useSmsState, type SmsTask } from '@/views/sms/sms.data'

const statusMap = { sending: { label: '发送中', type: 'warning' }, done: { label: '已完成', type: 'success' }, scheduled: { label: '待发送', type: 'info' }, paused: { label: '已暂停', type: 'default' }, cancelled: { label: '已取消', type: 'error' } }

export default defineComponent({
    name: 'WebSmsTask',
    setup() {
        const router = useRouter()
        const state = useSmsState()
        const visible = ref(false)
        const form = reactive({ current: undefined as SmsTask | undefined })
        function update(task: SmsTask, status: SmsTask['status']) {
            task.status = status
            if (status === 'cancelled') task.progress = task.progress
            return fetchNotifyService({ type: 'success', title: status === 'paused' ? '任务已暂停' : '任务已取消' })
        }
        return () => (
            <div class="sms-page">
                <header class="sms-head"><div><h2>批量发送任务</h2><p>实时监控批量短信下发进度，支持查看详情、暂停或取消定时任务</p></div><n-button type="primary" onClick={() => router.push('/web/sms/send')}>新建发送任务</n-button></header>
                <n-data-table columns={[
                    { title: '任务名称', key: 'name' },
                    { title: '关联模板', key: 'templateName' },
                    { title: '总条数', key: 'total' },
                    { title: '成功 / 失败', key: 'result', render: (row: SmsTask) => row.success.toLocaleString() + ' / ' + row.failed.toLocaleString() },
                    { title: '执行进度与状态', key: 'status', render: (row: SmsTask) => <div class="sms-progress"><n-tag size="small" type={statusMap[row.status].type}>{statusMap[row.status].label}{row.planTime ? ' (' + row.planTime + ')' : ''}</n-tag><n-progress percentage={row.progress} style={{ width: '120px' }} /></div> },
                    { title: '创建时间', key: 'createTime' },
                    { title: '操作', key: 'action', render: (row: SmsTask) => <n-space>{<n-button text type="primary" onClick={() => { form.current = row; visible.value = true }}>详情</n-button>}{(row.status === 'sending' || row.status === 'scheduled') && <n-button text onClick={() => update(row, 'paused')}>暂停</n-button>}{(row.status === 'sending' || row.status === 'scheduled' || row.status === 'paused') && <n-button text type="error" onClick={() => update(row, 'cancelled')}>取消</n-button>}</n-space> }
                ]} data={state.tasks} />
                <n-drawer show={visible.value} onUpdate:show={(value: boolean) => (visible.value = value)} width={420}><n-drawer-content title="任务详情">{form.current && <n-descriptions column={1} label-placement="left"><n-descriptions-item label="任务名称">{form.current.name}</n-descriptions-item><n-descriptions-item label="模板">{form.current.templateName}</n-descriptions-item><n-descriptions-item label="总条数">{form.current.total}</n-descriptions-item><n-descriptions-item label="成功">{form.current.success}</n-descriptions-item><n-descriptions-item label="失败">{form.current.failed}</n-descriptions-item><n-descriptions-item label="进度">{form.current.progress}%</n-descriptions-item></n-descriptions>}</n-drawer-content></n-drawer>
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
.sms-progress { display: flex; align-items: center; gap: 8px; }
</style>
