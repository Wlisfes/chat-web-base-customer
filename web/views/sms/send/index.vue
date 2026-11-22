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
        const total = computed(() => (form.mode === 'manual' ? phones.value.length : (file.value?.count ?? 0)))
        const preview = computed(() => {
            let content = template.value?.content ?? ''
            for (const key of template.value?.variables ?? []) content = content.replaceAll('${' + key + '}', form.values[key] || key)
            return content
        })
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
                phones.value
                    .slice(0, 20)
                    .forEach(phone =>
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
            <div class="sms-split">
                <div class="sms-page">
                    <header>
                        <h2>创建发送任务</h2>
                        <p>选择应用与已审核模板，填写变量参数并实时预览</p>
                    </header>
                    <n-form label-placement="top">
                        <n-form-item label="选择短信应用">
                            <n-select
                                v-model:value={form.appKeyId}
                                options={state.apps
                                    .filter(item => item.status === 'enabled')
                                    .map(item => ({ label: item.name + ' (' + item.appKey.slice(0, 16) + '...)', value: item.keyId }))}
                            />
                        </n-form-item>
                        <n-form-item label="选择短信模板">
                            <n-select
                                v-model:value={form.templateKeyId}
                                options={state.templates
                                    .filter(item => item.audit === 'passed')
                                    .map(item => ({ label: item.name + ' (' + item.templateId + ')', value: item.keyId }))}
                            />
                        </n-form-item>
                        <n-form-item label="接收号码">
                            <n-radio-group v-model:value={form.mode}>
                                <n-radio-button value="manual">手动输入</n-radio-button>
                                <n-radio-button value="file">选择号码文件</n-radio-button>
                            </n-radio-group>
                        </n-form-item>
                        {form.mode === 'manual' ? (
                            <n-input type="textarea" v-model:value={form.phones} placeholder="每行一个手机号" />
                        ) : (
                            <n-select
                                v-model:value={form.fileKeyId}
                                options={state.files
                                    .filter(item => item.status === 'ready')
                                    .map(item => ({
                                        label: item.name + ' (' + item.count.toLocaleString() + ' 个号码)',
                                        value: item.keyId
                                    }))}
                            />
                        )}
                        <p class="hint">已识别 {total.value.toLocaleString()} 个有效手机号码</p>
                        {(template.value?.variables ?? []).map(key => (
                            <n-form-item label={'变量 ${' + key + '}'}>
                                <n-input v-model:value={form.values[key]} />
                            </n-form-item>
                        ))}
                        <n-form-item label="发送时间">
                            <n-radio-group v-model:value={form.when}>
                                <n-radio value="now">立即发送</n-radio>
                                <n-radio value="plan">定时发送</n-radio>
                            </n-radio-group>
                            {form.when === 'plan' && (
                                <n-time-picker v-model:formatted-value={form.planTime} format="HH:mm" value-format="HH:mm" />
                            )}
                        </n-form-item>
                    </n-form>
                    <div class="sms-submit">
                        <span>
                            预估发送：{total.value.toLocaleString()} 条 · 预估费用：¥ {(total.value * 0.045).toFixed(3)}
                        </span>
                        <n-button type="primary" onClick={submit}>
                            确认发送
                        </n-button>
                    </div>
                </div>
                <n-card class="sms-preview">
                    <h3>实时效果预览</h3>
                    <div class="phone">
                        <span>1069 0312 8800</span>
                        <p>{preview.value}</p>
                    </div>
                    <p>字符统计：{preview.value.length} 字（含签名，单条上限 70 字）</p>
                </n-card>
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 16px;
}
.sms-page,
.sms-preview {
    background: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 16px;
}
.sms-page header h2,
.sms-preview h3 {
    margin: 0 0 8px;
}
.sms-page header p,
.hint,
.sms-preview p {
    color: var(--text-color-3);
    font-size: 13px;
}
.sms-submit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}
.phone {
    background: var(--body-color);
    border-radius: 16px;
    padding: 16px;
}
.phone p {
    margin-top: 12px;
    background: var(--card-color);
    border-radius: 8px;
    padding: 12px;
}
</style>
