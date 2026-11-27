<script lang="tsx">
import { computed, defineComponent, h, reactive } from 'vue'
import { DocumentBlank, FolderMoveTo } from '@vicons/carbon'
import { fetchNotifyService } from '@/plugins'
import { countPhones, formatNow, nextKey, useSmsState } from '@/views/sms/sms.data'

const statusOptions = [
    { value: 'ready', label: '校验完成', type: 'success' },
    { value: 'parsing', label: '解析去重中', type: 'warning' },
    { value: 'error', label: '格式错误', type: 'error' }
]

export default defineComponent({
    name: 'WebSmsFile',
    setup() {
        const state = useSmsState()
        const form = reactive({ checked: [] as number[] })
        const readyCount = computed(() => state.files.filter(item => item.status === 'ready').reduce((sum, item) => sum + item.count, 0))

        async function onFile(options: { file: { file?: File | null; name: string }; onFinish: () => void }) {
            const file = options.file.file
            if (!file) return options.onFinish()
            if (file.size > 20 * 1024 * 1024) {
                options.onFinish()
                return fetchNotifyService({ type: 'warning', title: '单文件最大 20MB' })
            }
            const content = await file.text().catch(() => '')
            const phones = countPhones(content)
            state.files.unshift({
                keyId: nextKey(state),
                name: file.name,
                count: phones.length,
                uploadTime: formatNow(),
                status: phones.length ? 'ready' : 'error',
                message: phones.length ? undefined : '未识别到有效手机号'
            })
            options.onFinish()
            return fetchNotifyService({
                type: phones.length ? 'success' : 'warning',
                title: phones.length ? `已识别 ${phones.length} 个号码` : '文件未通过校验'
            })
        }

        function downloadTemplate() {
            const blob = new Blob(['phone\n13800138000\n13912345678\n'], { type: 'text/csv;charset=utf-8' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '号码文件模板.csv'
            link.click()
            URL.revokeObjectURL(link.href)
        }

        function removeChecked() {
            state.files = state.files.filter(item => !form.checked.includes(item.keyId))
            form.checked = []
            return fetchNotifyService({ type: 'success', title: '已删除选中文件' })
        }

        function toggle(keyId: number, checked: boolean) {
            form.checked = checked ? [...form.checked, keyId] : form.checked.filter(item => item !== keyId)
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 overflow-auto">
                <common-base-element class="p-inline-20 p-block-20 flex items-center justify-between gap-16" is-white>
                    <common-base-header
                        title="号码文件"
                        document="上传批量发送号码包。系统会去重并校验 11 位手机号，单文件最大 20MB、50 万个号码。"
                    ></common-base-header>
                    <common-base-button onClick={downloadTemplate}>下载标准模板</common-base-button>
                </common-base-element>

                <div class="grid grid-cols-3 gap-14 max-[960px]:grid-cols-1">
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>文件数</n-text>
                        <n-text class="text-24 font-600">{state.files.length}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>可用号码</n-text>
                        <n-text class="text-24 font-600">{readyCount.value.toLocaleString()}</n-text>
                    </common-base-element>
                    <common-base-element class="p-16 flex flex-col gap-6" is-white is-border>
                        <n-text depth={3}>待处理</n-text>
                        <n-text class="text-24 font-600">{state.files.filter(item => item.status !== 'ready').length}</n-text>
                    </common-base-element>
                </div>

                <n-upload accept=".csv,.txt,.xlsx" show-file-list={false} custom-request={onFile}>
                    <common-base-element
                        class="flex items-center gap-14 p-inline-20 p-block-20 cursor-pointer"
                        is-white
                        is-border
                    >
                        <common-base-alert-wrapper class="p-10" type="info">
                            <n-icon size={24} color="var(--n-icon-color)">
                                {h(FolderMoveTo)}
                            </n-icon>
                        </common-base-alert-wrapper>
                        <div class="flex flex-col gap-4">
                            <n-text depth={1}>将号码文件拖到这里，或点击选择文件</n-text>
                            <n-text depth={3}>支持 CSV、TXT、XLSX。表头使用 phone，每行一个号码。</n-text>
                        </div>
                    </common-base-element>
                </n-upload>

                <common-base-element class="flex flex-col" is-white is-border>
                    <div
                        class="flex items-center justify-between gap-12 p-inline-16 p-block-12"
                        style={{ borderBottom: '1px solid var(--divider-color)' }}
                    >
                        <n-text depth={3}>已选 {form.checked.length} 个文件</n-text>
                        <common-base-button type="error" secondary disabled={!form.checked.length} onClick={removeChecked}>
                            批量删除
                        </common-base-button>
                    </div>
                    {state.files.length ? (
                        state.files.map(item => (
                            <div
                                class="grid grid-cols-[28px_36px_minmax(0,1.4fr)_120px_168px_120px_72px] gap-12 items-center p-inline-16 p-block-12 max-[1100px]:grid-cols-[28px_36px_minmax(0,1fr)_72px]"
                                key={item.keyId}
                                style={{ borderBottom: '1px solid var(--divider-color)' }}
                            >
                                <n-checkbox
                                    checked={form.checked.includes(item.keyId)}
                                    onUpdate:checked={(checked: boolean) => toggle(item.keyId, checked)}
                                ></n-checkbox>
                                <common-base-alert-wrapper class="p-6" type={item.status === 'error' ? 'error' : 'info'}>
                                    <n-icon size={16} color="var(--n-icon-color)">
                                        {h(DocumentBlank)}
                                    </n-icon>
                                </common-base-alert-wrapper>
                                <div class="flex flex-col min-w-0">
                                    <n-ellipsis tooltip={false}>
                                        <n-text depth={1}>{item.name}</n-text>
                                    </n-ellipsis>
                                    <n-text depth={3}>{item.count.toLocaleString()} 个号码</n-text>
                                </div>
                                <n-text class="max-[1100px]:hidden" depth={2}>
                                    {item.count.toLocaleString()}
                                </n-text>
                                <n-text class="max-[1100px]:hidden" depth={3}>
                                    {item.uploadTime}
                                </n-text>
                                <common-base-chunk class="max-[1100px]:hidden" value={item.status} items={statusOptions}>
                                    {item.message || statusOptions.find(option => option.value === item.status)?.label}
                                </common-base-chunk>
                                <n-button
                                    text
                                    type="error"
                                    onClick={() => {
                                        state.files = state.files.filter(file => file.keyId !== item.keyId)
                                    }}
                                >
                                    删除
                                </n-button>
                            </div>
                        ))
                    ) : (
                        <div class="flex flex-col items-center justify-center gap-6 min-h-180">
                            <n-text depth={1}>还没有号码文件</n-text>
                            <n-text depth={3}>先下载标准模板，填入手机号后再上传。</n-text>
                        </div>
                    )}
                </common-base-element>
            </common-base-element>
        )
    }
})
</script>
