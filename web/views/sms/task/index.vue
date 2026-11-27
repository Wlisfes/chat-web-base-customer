<script lang="tsx">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchNotifyService } from '@/plugins'
import { useSmsState, type SmsTask } from '@/views/sms/sms.data'

const statusOptions = [
    { value: 'sending', label: '发送中', type: 'warning' },
    { value: 'done', label: '已完成', type: 'success' },
    { value: 'scheduled', label: '待发送', type: 'info' },
    { value: 'paused', label: '已暂停', type: 'default' },
    { value: 'cancelled', label: '已取消', type: 'error' }
]

export default defineComponent({
    name: 'WebSmsTask',
    setup() {
        const router = useRouter()
        const state = useSmsState()
        const visible = ref(false)
        const filter = ref('all')
        const form = reactive({ current: undefined as SmsTask | undefined })
        const list = computed(() => (filter.value === 'all' ? state.tasks : state.tasks.filter(item => item.status === filter.value)))
        const summary = computed(() => ({
            sending: state.tasks.filter(item => item.status === 'sending').length,
            scheduled: state.tasks.filter(item => item.status === 'scheduled').length,
            done: state.tasks.filter(item => item.status === 'done').length
        }))

        function update(task: SmsTask, status: SmsTask['status']) {
            task.status = status
            return fetchNotifyService({ type: 'success', title: status === 'paused' ? '任务已暂停' : status === 'sending' ? '任务已继续' : '任务已取消' })
        }

        function open(task: SmsTask) {
            form.current = task
            visible.value = true
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20 flex items-center justify-between gap-16" is-white>
                    <common-base-header title="发送任务" document="跟踪批量下发进度。发送中和待发送的任务可以暂停或取消。"></common-base-header>
                    <common-base-button type="primary" onClick={() => router.push('/web/sms/send')}>
                        新建发送任务
                    </common-base-button>
                </common-base-element>

                <div class="grid grid-cols-3 gap-14 max-[860px]:grid-cols-1">
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>发送中</n-text>
                        <n-text class="text-24 font-600">{summary.value.sending}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>待发送</n-text>
                        <n-text class="text-24 font-600">{summary.value.scheduled}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>已完成</n-text>
                        <n-text class="text-24 font-600">{summary.value.done}</n-text>
                    </common-base-element>
                </div>

                <common-base-element class="flex flex-col" is-white is-border>
                    <div class="flex items-center gap-8 p-inline-16 p-block-12 overflow-auto" style={{ borderBottom: '1px solid var(--divider-color)' }}>
                        <n-radio-group v-model:value={filter.value} size="small">
                            <n-radio-button value="all">全部</n-radio-button>
                            {statusOptions.map(item => (
                                <n-radio-button value={item.value}>{item.label}</n-radio-button>
                            ))}
                        </n-radio-group>
                    </div>
                    {list.value.length ? (
                        list.value.map(item => (
                            <div
                                class="grid grid-cols-[minmax(0,1.4fr)_160px_120px_180px_168px_auto] gap-12 items-center p-inline-16 p-block-14 max-[1100px]:grid-cols-1"
                                key={item.keyId}
                                style={{ borderBottom: '1px solid var(--divider-color)' }}
                            >
                                <div class="flex flex-col gap-4 min-w-0">
                                    <n-ellipsis tooltip={false}>
                                        <n-text depth={1}>{item.name}</n-text>
                                    </n-ellipsis>
                                    <n-text depth={3}>{item.templateName}</n-text>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <n-text depth={3}>总条数</n-text>
                                    <n-text depth={1}>{item.total.toLocaleString()}</n-text>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <n-text depth={3}>成功 / 失败</n-text>
                                    <n-text depth={1}>
                                        {item.success.toLocaleString()} / {item.failed.toLocaleString()}
                                    </n-text>
                                </div>
                                <div class="flex flex-col gap-6">
                                    <div class="flex items-center justify-between gap-8">
                                        <common-base-chunk value={item.status} items={statusOptions}>
                                            {statusOptions.find(option => option.value === item.status)?.label}
                                            {item.planTime ? ` ${item.planTime}` : ''}
                                        </common-base-chunk>
                                        <n-text depth={3}>{item.progress}%</n-text>
                                    </div>
                                    <n-progress type="line" percentage={item.progress} show-indicator={false} height={6}></n-progress>
                                </div>
                                <n-text depth={3}>{item.createTime}</n-text>
                                <div class="flex items-center justify-end gap-8">
                                    <n-button text type="primary" onClick={() => open(item)}>
                                        详情
                                    </n-button>
                                    {(item.status === 'sending' || item.status === 'scheduled') && (
                                        <n-button text onClick={() => update(item, 'paused')}>
                                            暂停
                                        </n-button>
                                    )}
                                    {item.status === 'paused' && (
                                        <n-button text type="primary" onClick={() => update(item, 'sending')}>
                                            继续
                                        </n-button>
                                    )}
                                    {['sending', 'scheduled', 'paused'].includes(item.status) && (
                                        <n-button text type="error" onClick={() => update(item, 'cancelled')}>
                                            取消
                                        </n-button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div class="flex flex-col items-center justify-center gap-8 min-h-220">
                            <n-text depth={1}>这个状态下没有任务</n-text>
                            <common-base-button type="primary" onClick={() => router.push('/web/sms/send')}>
                                去创建发送任务
                            </common-base-button>
                        </div>
                    )}
                </common-base-element>

                <n-drawer show={visible.value} width={420} onUpdate:show={(value: boolean) => (visible.value = value)}>
                    <n-drawer-content title="任务详情" native-scrollbar={false}>
                        {form.current && (
                            <div class="flex flex-col gap-12">
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="任务名称">
                                    {form.current.name}
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="关联模板">
                                    {form.current.templateName}
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="状态">
                                    <common-base-chunk value={form.current.status} items={statusOptions}></common-base-chunk>
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="总条数">
                                    {form.current.total.toLocaleString()}
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="成功">
                                    {form.current.success.toLocaleString()}
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-5em m-ie-10" label="失败">
                                    {form.current.failed.toLocaleString()}
                                </common-base-columns-wrapper>
                                <n-progress type="line" percentage={form.current.progress}></n-progress>
                                <n-text depth={3}>创建于 {form.current.createTime}</n-text>
                            </div>
                        )}
                    </n-drawer-content>
                </n-drawer>
            </common-base-element>
        )
    }
})
</script>
