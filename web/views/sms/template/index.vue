<script lang="tsx">
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { fetchNotifyService } from '@/plugins'
import { formatNow, nextKey, SMS_TYPE_OPTIONS, useSmsState, type SmsTemplateType } from '@/views/sms/sms.data'

const auditMap = { passed: { label: '已通过', type: 'success' }, pending: { label: '审核中', type: 'warning' }, rejected: { label: '已驳回', type: 'error' } }

export default defineComponent({
    name: 'WebSmsTemplate',
    setup() {
        const router = useRouter()
        const state = useSmsState()
        const form = reactive({ keyword: '', type: 'all', selected: 1, visible: false, name: '', templateType: 'notify' as SmsTemplateType, content: '' })
        const list = computed(() => state.templates.filter(item => (!form.keyword || item.name.includes(form.keyword) || item.templateId.includes(form.keyword)) && (form.type === 'all' || item.type === form.type)))
        const current = computed(() => state.templates.find(item => item.keyId === form.selected) ?? list.value[0])
        async function createTemplate() {
            if (!form.name.trim() || !form.content.trim()) return fetchNotifyService({ type: 'warning', title: '请填写模板名称和内容' })
            const item = { keyId: nextKey(state), name: form.name.trim(), templateId: 'SMS_' + Date.now().toString().slice(-8), type: form.templateType, audit: 'pending' as const, content: form.content.trim(), variables: [...form.content.matchAll(/\$\{(\w+)\}/g)].map(match => match[1]) }
            state.templates.unshift(item)
            form.selected = item.keyId
            form.visible = false
            return fetchNotifyService({ type: 'success', title: '模板已提交审核' })
        }
        return () => (
            <div class="sms-split">
                <div class="sms-page">
                    <header class="sms-head"><div><h2>短信模板库</h2><p>管理验证码、行业通知与营销推广模板</p></div><n-button type="primary" onClick={() => (form.visible = true)}>新建模板</n-button></header>
                    <div class="sms-toolbar">
                        <n-input clearable placeholder="搜索模板" v-model:value={form.keyword} style={{ width: '220px' }} />
                        <n-radio-group v-model:value={form.type}>
                            <n-radio-button value="all">全部类型</n-radio-button>
                            {SMS_TYPE_OPTIONS.map(item => <n-radio-button value={item.value}>{item.label}</n-radio-button>)}
                        </n-radio-group>
                    </div>
                    <n-data-table size="small" row-class-name={(row: Omix) => row.keyId === current.value?.keyId ? 'is-current' : ''} row-props={(row: Omix) => ({ style: 'cursor:pointer', onClick: () => (form.selected = row.keyId) })} columns={[
                        { title: '模板名称', key: 'name' },
                        { title: '模板 ID', key: 'templateId' },
                        { title: '类型', key: 'type', render: (row: Omix) => SMS_TYPE_OPTIONS.find(item => item.value === row.type)?.label },
                        { title: '审核状态', key: 'audit', render: (row: Omix) => <n-tag size="small" type={auditMap[row.audit].type}>{auditMap[row.audit].label}</n-tag> },
                        { title: '操作', key: 'action', render: (row: Omix) => <n-button text type="error" onClick={(event: MouseEvent) => { event.stopPropagation(); state.templates = state.templates.filter(item => item.keyId !== row.keyId) }}>删除</n-button> }
                    ]} data={list.value} />
                </div>
                <n-card class="sms-preview" v-show={!!current.value}>
                    <h3>模板预览</h3>
                    <div class="phone"><span>1069 0312 8800</span><p>{current.value?.content}</p></div>
                    <p>当前字数：{current.value?.content.length ?? 0} 字</p>
                    <p>模板类型：{SMS_TYPE_OPTIONS.find(item => item.value === current.value?.type)?.label}</p>
                    <p>变量参数：{current.value?.variables.join('、') || '无'}</p>
                    <n-button type="primary" disabled={current.value?.audit !== 'passed'} onClick={() => router.push({ path: '/web/sms/send', query: { templateId: String(current.value?.keyId) } })}>使用此模板发送</n-button>
                </n-card>
                <n-modal v-model:show={form.visible} preset="dialog" title="新建模板" positive-text="提交审核" negative-text="取消" onPositiveClick={createTemplate}>
                    <n-form>
                        <n-form-item label="模板名称"><n-input v-model:value={form.name} /></n-form-item>
                        <n-form-item label="模板类型"><n-select v-model:value={form.templateType} options={SMS_TYPE_OPTIONS} /></n-form-item>
                        <n-form-item label="模板内容"><n-input type="textarea" v-model:value={form.content} placeholder="使用 ${code} 声明变量" /></n-form-item>
                    </n-form>
                </n-modal>
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-split { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; }
.sms-page, .sms-preview { display: flex; flex-direction: column; gap: 12px; }
.sms-head { display: flex; justify-content: space-between; align-items: center; }
.sms-head h2, .sms-preview h3 { margin: 0; }
.sms-head p, .sms-preview p { margin: 0; color: var(--text-color-3); font-size: 13px; }
.sms-toolbar { display: flex; gap: 12px; }
.sms-preview { background: var(--card-color); border: 1px solid var(--border-color); border-radius: 4px; padding: 16px; }
.phone { background: var(--body-color); border-radius: 16px; padding: 16px; }
.phone p { margin-top: 12px; background: var(--card-color); border-radius: 8px; padding: 12px; line-height: 22px; }
</style>
