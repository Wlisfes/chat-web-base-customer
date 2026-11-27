<script lang="tsx">
import { computed, defineComponent, h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Document, TrashCan } from '@vicons/carbon'
import { fetchNotifyService } from '@/plugins'
import { formatNow, nextKey, SMS_TYPE_OPTIONS, useSmsState, type SmsTemplate, type SmsTemplateType } from '@/views/sms/sms.data'

const auditOptions = [
    { value: 'passed', label: '已通过', type: 'success' },
    { value: 'pending', label: '审核中', type: 'warning' },
    { value: 'rejected', label: '已驳回', type: 'error' }
]

const typeTone: Record<SmsTemplateType, string> = {
    otp: 'success',
    notify: 'info',
    market: 'warning'
}

export default defineComponent({
    name: 'WebSmsTemplate',
    setup() {
        const router = useRouter()
        const state = useSmsState()
        const form = reactive({
            keyword: '',
            type: 'all',
            visible: false,
            name: '',
            templateType: 'notify' as SmsTemplateType,
            content: ''
        })
        const list = computed(() =>
            state.templates.filter(
                item =>
                    (!form.keyword || item.name.includes(form.keyword) || item.templateId.includes(form.keyword)) &&
                    (form.type === 'all' || item.type === form.type)
            )
        )
        const passed = computed(() => state.templates.filter(item => item.audit === 'passed').length)

        async function createTemplate() {
            if (!form.name.trim() || !form.content.trim()) return fetchNotifyService({ type: 'warning', title: '请填写模板名称和内容' })
            const item: SmsTemplate = {
                keyId: nextKey(state),
                name: form.name.trim(),
                templateId: 'SMS_' + Date.now().toString().slice(-8),
                type: form.templateType,
                audit: 'pending',
                content: form.content.trim(),
                variables: [...form.content.matchAll(/\$\{(\w+)\}/g)].map(match => match[1])
            }
            state.templates.unshift(item)
            form.visible = false
            form.name = ''
            form.content = ''
            return fetchNotifyService({ type: 'success', title: '模板已提交审核', message: formatNow() })
        }

        function removeTemplate(item: SmsTemplate) {
            state.templates = state.templates.filter(template => template.keyId !== item.keyId)
            return fetchNotifyService({ type: 'success', title: '模板已删除' })
        }

        function sendWith(item: SmsTemplate) {
            if (item.audit !== 'passed') return fetchNotifyService({ type: 'warning', title: '模板审核通过后才能发送' })
            return router.push({ path: '/web/sms/send', query: { templateId: String(item.keyId) } })
        }

        return () => (
            <common-base-element class="flex flex-col overflow-hidden">
                <common-base-element is-white>
                    <div class="flex items-center justify-between gap-16 p-inline-20 p-block-20 max-[760px]:flex-col max-[760px]:items-stretch">
                        <common-base-header
                            title="短信模板管理"
                            document={`已通过 ${passed.value} 个模板。未通过审核的模板不能用于发送短信。`}
                        ></common-base-header>
                        <div class="flex items-center gap-10 shrink-0">
                            <n-input
                                clearable
                                placeholder="搜索模板名称或 ID"
                                v-model:value={form.keyword}
                                style={{ width: '220px' }}
                            ></n-input>
                            <n-select
                                v-model:value={form.type}
                                style={{ width: '132px' }}
                                options={[{ label: '全部类型', value: 'all' }, ...SMS_TYPE_OPTIONS]}
                            ></n-select>
                        </div>
                    </div>
                </common-base-element>

                <common-base-columns-template class="gap-14 p-20" type="auto-fill" number={320}>
                    {list.value.map(item => (
                        <common-base-element key={item.keyId} is-white is-border>
                            <div class="flex gap-x-10 p-inline-14 p-block-14 overflow-hidden">
                                <common-base-alert-wrapper class="p-10" type={typeTone[item.type]}>
                                    <n-icon size={28} color="var(--n-icon-color)">
                                        {h(Document)}
                                    </n-icon>
                                </common-base-alert-wrapper>
                                <div class="flex flex-col flex-1 gap-y-2 overflow-hidden">
                                    <n-ellipsis tooltip={false}>
                                        <n-text class="text-16 line-height-24" depth={1}>
                                            {item.name}
                                        </n-text>
                                    </n-ellipsis>
                                    <n-text class="line-height-22" depth={3}>
                                        模板名称
                                    </n-text>
                                </div>
                                <div class="m-be-auto">
                                    <common-base-chunk value={item.type} items={SMS_TYPE_OPTIONS}></common-base-chunk>
                                </div>
                            </div>
                            <div class="flex flex-col gap-y-10 p-inline-14 p-be-14 overflow-hidden">
                                <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="模板ID">
                                    <n-ellipsis tooltip={false}>{item.templateId}</n-ellipsis>
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="审核状态">
                                    <common-base-chunk value={item.audit} items={auditOptions}></common-base-chunk>
                                </common-base-columns-wrapper>
                                <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="模板内容">
                                    <n-ellipsis tooltip={{ width: 280 }} line-clamp={2}>
                                        {item.content}
                                    </n-ellipsis>
                                </common-base-columns-wrapper>
                            </div>
                            <div
                                class="flex p-14 gap-x-14 items-center justify-end"
                                style={{ borderTop: '1px solid var(--divider-color)' }}
                            >
                                <common-base-button
                                    class="p-inline-6"
                                    secondary
                                    icon-size={20}
                                    icon={TrashCan}
                                    onClick={() => removeTemplate(item)}
                                ></common-base-button>
                                <common-base-button secondary disabled={item.audit !== 'passed'} onClick={() => sendWith(item)}>
                                    发送短信
                                </common-base-button>
                            </div>
                        </common-base-element>
                    ))}
                    {list.value.length === 0 && (
                        <common-base-element class="p-14 flex flex-col gap-y-8 h-246 items-center justify-center" is-white is-border>
                            <n-text depth={1}>没有匹配的模板</n-text>
                            <common-base-button
                                text
                                type="primary"
                                onClick={() => {
                                    form.keyword = ''
                                    form.type = 'all'
                                }}
                            >
                                重置筛选
                            </common-base-button>
                        </common-base-element>
                    )}
                    <common-base-element class="p-14 flex flex-col gap-y-5 h-246 items-center justify-center" is-white is-border>
                        <common-base-button text type="primary" onClick={() => (form.visible = true)}>
                            <common-base-icon size={18} name="nest-plus"></common-base-icon>
                            <span class="text-16 p-is-5">添加模板</span>
                        </common-base-button>
                        <n-text depth={3}>
                            已添加模板数：{state.templates.length}，审核通过：{passed.value}
                        </n-text>
                    </common-base-element>
                </common-base-columns-template>
                <common-dialog-provider
                    title="新建模板"
                    width={560}
                    submit="提交审核"
                    v-model:visible={form.visible}
                    on-submit={createTemplate}
                    on-cancel={() => (form.visible = false)}
                >
                    <n-form label-placement="top">
                        <n-form-item label="模板名称">
                            <n-input v-model:value={form.name} placeholder="例如：登录动态验证码"></n-input>
                        </n-form-item>
                        <n-form-item label="模板类型">
                            <n-select v-model:value={form.templateType} options={SMS_TYPE_OPTIONS}></n-select>
                        </n-form-item>
                        <n-form-item label="模板内容">
                            <n-input
                                type="textarea"
                                rows={5}
                                v-model:value={form.content}
                                placeholder="使用 ${code} 声明变量，签名请写在文案开头"
                            ></n-input>
                        </n-form-item>
                        <n-text depth={3}>
                            当前 {form.content.length} 字。单条短信上限 70 字，变量用 {'${name}'} 声明。
                        </n-text>
                    </n-form>
                </common-dialog-provider>
            </common-base-element>
        )
    }
})
</script>
