<script lang="tsx">
import { computed, defineComponent, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchNotifyService } from '@/plugins'
import { countPhones, formatNow, nextKey, useSmsState } from '@/views/sms/sms.data'

export default defineComponent({
    name: 'WebSmsSend',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const state = useSmsState()
        const form = reactive({
            appKeyId: state.apps.find(item => item.status === 'enabled')?.keyId,
            templateKeyId: Number(route.query.templateId) || state.templates.find(item => item.audit === 'passed')?.keyId,
            mode: 'manual',
            phones: '13800138000\n13912345678\n18600219988',
            fileKeyId: state.files.find(item => item.status === 'ready')?.keyId,
            when: 'now',
            planTime: '20:00',
            values: {} as Record<string, string>
        })
        const template = computed(() => state.templates.find(item => item.keyId === form.templateKeyId))
        const app = computed(() => state.apps.find(item => item.keyId === form.appKeyId))
        const file = computed(() => state.files.find(item => item.keyId === form.fileKeyId))
        const phones = computed(() => countPhones(form.phones))
        const total = computed(() => (form.mode === 'manual' ? phones.value.length : file.value?.count ?? 0))
        const segments = computed(() => Math.max(1, Math.ceil((preview.value.length || 1) / 70)))
        const preview = computed(() => {
            let content = template.value?.content ?? ''
            for (const key of template.value?.variables ?? []) content = content.replaceAll('${' + key + '}', form.values[key] || '${' + key + '}')
            return content
        })
        const fee = computed(() => (total.value * segments.value * 0.045).toFixed(2))

        watch(
            template,
            value => {
                for (const key of value?.variables ?? []) if (!(key in form.values)) form.values[key] = ''
            },
            { immediate: true }
        )

        async function submit() {
            if (!app.value || !template.value || template.value.audit !== 'passed')
                return fetchNotifyService({ type: 'warning', title: '请选择已启用应用和已通过模板' })
            if (!total.value) return fetchNotifyService({ type: 'warning', title: '请填写有效手机号或选择号码文件' })
            const missing = (template.value.variables ?? []).filter(key => !form.values[key]?.trim())
            if (missing.length) return fetchNotifyService({ type: 'warning', title: '请补全模板变量', message: missing.join('、') })
            state.tasks.unshift({
                keyId: nextKey(state),
                name: template.value.name + '发送',
                templateName: template.value.name,
                total: total.value,
                success: form.when === 'now' ? total.value : 0,
                failed: 0,
                progress: form.when === 'now' ? 100 : 0,
                status: form.when === 'now' ? 'done' : 'scheduled',
                planTime: form.when === 'plan' ? form.planTime : undefined,
                createTime: formatNow()
            })
            if (form.when === 'now') {
                phones.value.slice(0, 20).forEach(phone =>
                    state.records.unshift({
                        keyId: nextKey(state),
                        phone,
                        appName: app.value!.name,
                        templateName: template.value!.name,
                        status: 'success',
                        sendTime: formatNow()
                    })
                )
                state.balance = Math.max(0, state.balance - total.value)
            }
            await fetchNotifyService({ type: 'success', title: form.when === 'now' ? '发送任务已提交' : '定时任务已创建' })
            return router.push('/web/sms/task')
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20" is-white>
                    <common-base-header
                        title="发送短信"
                        document="选择已启用应用和已通过审核的模板。变量会即时写入右侧预览。"
                    ></common-base-header>
                </common-base-element>

                <div class="grid grid-cols-[minmax(0,1fr)_340px] gap-14 items-start max-[1080px]:grid-cols-1">
                    <common-base-element class="flex flex-col" is-white is-border>
                        <div class="flex flex-col gap-4 p-inline-20 p-block-16" style={{ borderBottom: '1px solid var(--divider-color)' }}>
                            <n-text class="text-16" depth={1}>
                                发送配置
                            </n-text>
                            <n-text depth={3}>手动输入适合小批量，号码文件适合已去重的人群包。</n-text>
                        </div>
                        <n-form class="p-inline-20 p-block-16" label-placement="top">
                            <div class="grid grid-cols-2 gap-14 max-[760px]:grid-cols-1">
                                <n-form-item label="短信应用">
                                    <n-select
                                        v-model:value={form.appKeyId}
                                        options={state.apps
                                            .filter(item => item.status === 'enabled')
                                            .map(item => ({ label: item.name, value: item.keyId }))}
                                    ></n-select>
                                </n-form-item>
                                <n-form-item label="短信模板">
                                    <n-select
                                        v-model:value={form.templateKeyId}
                                        options={state.templates
                                            .filter(item => item.audit === 'passed')
                                            .map(item => ({ label: item.name, value: item.keyId }))}
                                    ></n-select>
                                </n-form-item>
                            </div>
                            <n-form-item label="接收号码">
                                <n-radio-group v-model:value={form.mode}>
                                    <n-radio-button value="manual">手动输入</n-radio-button>
                                    <n-radio-button value="file">号码文件</n-radio-button>
                                </n-radio-group>
                            </n-form-item>
                            {form.mode === 'manual' ? (
                                <n-input type="textarea" rows={6} v-model:value={form.phones} placeholder="每行一个手机号"></n-input>
                            ) : (
                                <n-select
                                    v-model:value={form.fileKeyId}
                                    options={state.files
                                        .filter(item => item.status === 'ready')
                                        .map(item => ({ label: `${item.name} · ${item.count.toLocaleString()} 个号码`, value: item.keyId }))}
                                ></n-select>
                            )}
                            <n-text class="block p-bs-8" depth={3}>
                                已识别 {total.value.toLocaleString()} 个有效手机号
                            </n-text>
                            {(template.value?.variables ?? []).length > 0 && (
                                <div class="grid grid-cols-2 gap-14 p-bs-14 max-[760px]:grid-cols-1">
                                    {(template.value?.variables ?? []).map(key => (
                                        <n-form-item label={'变量 ${' + key + '}'}>
                                            <n-input v-model:value={form.values[key]} placeholder={'填写 ' + key}></n-input>
                                        </n-form-item>
                                    ))}
                                </div>
                            )}
                            <n-form-item class="p-bs-8" label="发送时间">
                                <div class="flex items-center gap-16 flex-wrap">
                                    <n-radio-group v-model:value={form.when}>
                                        <n-radio value="now">立即发送</n-radio>
                                        <n-radio value="plan">定时发送</n-radio>
                                    </n-radio-group>
                                    {form.when === 'plan' && (
                                        <n-time-picker v-model:formatted-value={form.planTime} format="HH:mm" value-format="HH:mm"></n-time-picker>
                                    )}
                                </div>
                            </n-form-item>
                        </n-form>
                        <div
                            class="flex items-center justify-between gap-12 p-inline-20 p-block-16"
                            style={{ borderTop: '1px solid var(--divider-color)' }}
                        >
                            <div class="flex flex-col">
                                <n-text depth={1}>预估 {total.value.toLocaleString()} 条 · {segments.value} 段计费</n-text>
                                <n-text depth={3}>预估费用 ¥{fee.value} · 单价 ¥0.045 / 段</n-text>
                            </div>
                            <common-base-button type="primary" onClick={submit}>
                                {form.when === 'now' ? '确认发送' : '创建定时任务'}
                            </common-base-button>
                        </div>
                    </common-base-element>

                    <common-base-element class="flex flex-col" is-white is-border>
                        <div class="p-inline-16 p-block-14" style={{ borderBottom: '1px solid var(--divider-color)' }}>
                            <n-text class="text-16" depth={1}>
                                实时预览
                            </n-text>
                        </div>
                        <div class="flex flex-col gap-14 p-16">
                            <div class="rounded-16 p-16 bg-[var(--body-color)]">
                                <n-text depth={3}>{app.value?.signature ?? '云信'} · 1069 0312 8800</n-text>
                                <div class="m-bs-12 rounded-8 p-12 bg-[var(--card-color)] line-height-22">{preview.value || '选择模板后在这里预览正文'}</div>
                            </div>
                            <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用">
                                {app.value?.name ?? '-'}
                            </common-base-columns-wrapper>
                            <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="模板">
                                {template.value?.name ?? '-'}
                            </common-base-columns-wrapper>
                            <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="字数">
                                {preview.value.length} 字 · {segments.value} 条计费
                            </common-base-columns-wrapper>
                            <n-text depth={3}>单条上限 70 字，超出按 67 字分段。当前按 70 字估算。</n-text>
                        </div>
                    </common-base-element>
                </div>
            </common-base-element>
        )
    }
})
</script>
