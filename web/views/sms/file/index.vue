<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { fetchNotifyService } from '@/plugins'
import { countPhones, formatNow, nextKey, useSmsState } from '@/views/sms/sms.data'

const statusMap = { ready: { label: '校验完成', type: 'success' }, parsing: { label: '解析去重中', type: 'warning' }, error: { label: '格式错误', type: 'error' } }

export default defineComponent({
    name: 'WebSmsFile',
    setup() {
        const state = useSmsState()
        const form = reactive({ checked: [] as number[] })
        async function onFile(options: { file: { file?: File | null; name: string }; onFinish: () => void }) {
            const file = options.file.file
            if (!file) return options.onFinish()
            if (file.size > 20 * 1024 * 1024) {
                options.onFinish()
                return fetchNotifyService({ type: 'warning', title: '单文件最大 20MB' })
            }
            const content = await file.text().catch(() => '')
            const phones = countPhones(content)
            state.files.unshift({ keyId: nextKey(state), name: file.name, count: phones.length, uploadTime: formatNow(), status: phones.length ? 'ready' : 'error', message: phones.length ? undefined : '未识别到有效手机号' })
            options.onFinish()
            return fetchNotifyService({ type: phones.length ? 'success' : 'warning', title: phones.length ? `已识别 ${phones.length} 个号码` : '文件未通过校验' })
        }
        function downloadTemplate() {
            const blob = new Blob(['phone\n13800138000\n13912345678\n'], { type: 'text/csv;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '号码文件模板.csv'
            link.click()
            URL.revokeObjectURL(link.href)
        }
        return () => (
            <div class="sms-page">
                <header class="sms-head"><div><h2>号码文件管理</h2><p>上传并管理批量发送的客户手机号包，自动去重并校验号段格式</p></div></header>
                <n-upload accept=".csv,.txt,.xlsx" show-file-list={false} custom-request={onFile}>
                    <n-upload-dragger>
                        <n-text>将号码文件拖拽至此处，或点击选择文件上传</n-text>
                        <n-text depth={3}>支持 .CSV、.TXT、.XLSX 格式，单文件最大 20MB，最多包含 500,000 个号码</n-text>
                    </n-upload-dragger>
                </n-upload>
                <div class="sms-toolbar">
                    <n-button onClick={downloadTemplate}>下载标准模板</n-button>
                    <n-button disabled={!form.checked.length} type="error" ghost onClick={() => { state.files = state.files.filter(item => !form.checked.includes(item.keyId)); form.checked = [] }}>批量删除</n-button>
                    <span>已选 {form.checked.length} 个文件 · 共 {state.files.length} 个文件</span>
                </div>
                <n-data-table v-model:checked-row-keys={form.checked} row-key={(row: Omix) => row.keyId} columns={[
                    { type: 'selection' },
                    { title: '文件名', key: 'name' },
                    { title: '号码数量', key: 'count' },
                    { title: '上传时间', key: 'uploadTime' },
                    { title: '状态', key: 'status', render: (row: Omix) => <n-tag size="small" type={statusMap[row.status].type}>{row.message || statusMap[row.status].label}</n-tag> },
                    { title: '操作', key: 'action', render: (row: Omix) => <n-button text type="error" onClick={() => { state.files = state.files.filter(item => item.keyId !== row.keyId) }}>删除</n-button> }
                ]} data={state.files} />
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-page { display: flex; flex-direction: column; gap: 16px; }
.sms-head h2 { margin: 0; }
.sms-head p, .sms-drop span, .sms-toolbar span { color: var(--text-color-3); font-size: 13px; }
.sms-drop { display: flex; flex-direction: column; gap: 6px; align-items: center; padding: 28px; border: 1px dashed var(--primary-color); border-radius: 4px; background: color-mix(in srgb, var(--primary-color) 16%, transparent); cursor: pointer; }
.sms-drop input { display: none; }
.sms-toolbar { display: flex; align-items: center; gap: 12px; }
</style>
