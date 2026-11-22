<script lang="tsx">
import { defineComponent, h, reactive, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, ChatBot, ChatLaunch } from '@vicons/carbon'
import { useChunkService, useColumnService } from '@/hooks'
import { fetchNotifyService } from '@/plugins'
import * as Service from '@/api'

const SMS_APP_ICONS: Record<string, Component> = {
    MRKT: ChatBot,
    NTFY: ChatLaunch,
    SOTP: Chat
}

export default defineComponent({
    name: 'WebSmsApp',
    setup() {
        const router = useRouter()
        const { chunkOptions } = useChunkService(() => Service.httpBaseSmsAppEnums(), { immediate: true })
        const { state, formState, fetchRefresh } = useColumnService(
            (base, payload) => Service.httpBaseSmsColumnApp({ ...payload, page: base.page, size: base.size }),
            {
                formState: { appAlias: undefined, status: null },
                immediate: true
            }
        )
        const form = reactive({ visible: false, type: undefined as string | undefined, remark: '' })

        async function createApp() {
            if (!form.type) return fetchNotifyService({ type: 'warning', title: '请选择应用类型' })
            try {
                await Service.httpBaseSmsCreateApp({ type: form.type, remark: form.remark || undefined })
                form.visible = false
                form.type = undefined
                form.remark = ''
                await fetchNotifyService({ type: 'success', title: '应用已创建' })
                return fetchRefresh()
            } catch (err) {
                return fetchNotifyService({ type: 'error', title: err.message })
            }
        }

        async function toggleStatus(item: Omix) {
            const status = item.status === 'active' ? 'disable' : 'active'
            try {
                await Service.httpBaseSmsUpdateApp({ keyId: item.keyId, type: item.type, status })
                await fetchNotifyService({ type: 'success', title: status === 'active' ? '应用已启用' : '应用已停用' })
                return fetchRefresh()
            } catch (err) {
                return fetchNotifyService({ type: 'error', title: err.message })
            }
        }

        return () => <div>dasdasda</div>

        return () => (
            <div class="flex flex-col gap-16">
                <div class="flex items-start justify-between gap-16">
                    <div class="flex flex-col gap-6">
                        <n-text class="text-20 font-600">短信应用管理</n-text>
                        <n-text depth={3}>管理各业务线 API 调用凭证与通道启停状态</n-text>
                    </div>
                    <n-button type="primary" onClick={() => (form.visible = true)}>
                        创建应用
                    </n-button>
                </div>
                <div class="flex items-center gap-12 flex-wrap">
                    <n-input
                        clearable
                        placeholder="搜索应用别名"
                        v-model:value={formState.value.appAlias}
                        style={{ width: '240px' }}
                        onKeydown={(event: KeyboardEvent) => event.key === 'Enter' && fetchRefresh()}
                    />
                    <n-radio-group v-model:value={formState.value.status} onUpdate:value={() => fetchRefresh()}>
                        <n-radio-button value={null}>全部状态</n-radio-button>
                        <n-radio-button value="active">仅看已激活</n-radio-button>
                        <n-radio-button value="disable">仅看已停用</n-radio-button>
                    </n-radio-group>
                </div>
                <n-spin show={state.loading}>
                    <common-base-columns-template class="gap-14" type="auto-fill" number={320}>
                        {state.dataSource.map((item: Omix) => (
                            <n-card key={item.keyId} content-class="flex flex-col p-0! overflow-hidden">
                                <div class="flex gap-x-10 p-inline-14 p-block-14 overflow-hidden">
                                    <common-base-alert-wrapper
                                        class="p-10"
                                        type="info"
                                        value={item.type}
                                        items={chunkOptions.value.typeOptions}
                                    >
                                        <n-icon size={28} color="var(--n-icon-color)">
                                            {h(SMS_APP_ICONS[item.type] ?? Chat)}
                                        </n-icon>
                                    </common-base-alert-wrapper>
                                    <div class="flex flex-col flex-1 gap-y-2 overflow-hidden">
                                        <n-text class="text-16 line-height-24">{item.appAlias ?? '-'}</n-text>
                                        <n-text depth={3}>应用别名</n-text>
                                    </div>
                                    <common-base-chunk value={item.type} items={chunkOptions.value.typeOptions}></common-base-chunk>
                                </div>
                                <div class="flex flex-col gap-y-10 p-inline-14 p-be-14 overflow-hidden">
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用ID">
                                        {item.appId ?? '-'}
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用名称">
                                        {item.appName ?? '-'}
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用状态">
                                        <common-base-chunk value={item.status} items={chunkOptions.value.statusOptions}></common-base-chunk>
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="备注">
                                        {item.remark || '-'}
                                    </common-base-columns-wrapper>
                                </div>
                                <div class="flex items-center gap-8 p-inline-14 p-be-14">
                                    <n-button size="small" onClick={() => router.push('/web/sms/stat')}>
                                        查看统计
                                    </n-button>
                                    <n-button size="small" onClick={() => toggleStatus(item)}>
                                        {item.status === 'active' ? '停用' : '启用应用'}
                                    </n-button>
                                </div>
                            </n-card>
                        ))}
                        <n-card content-class="flex flex-col p-0! overflow-hidden">
                            <div class="box-border flex flex-col flex-1 p-14 min-h-216 items-center justify-center">
                                <n-button text type="primary" onClick={() => (form.visible = true)}>
                                    <common-base-icon size={18} name="nest-plus"></common-base-icon>
                                    <span class="text-16 p-is-5">添加应用</span>
                                </n-button>
                                <n-text depth={3}>已添加应用数：{state.total}</n-text>
                            </div>
                        </n-card>
                    </common-base-columns-template>
                </n-spin>
                <n-modal
                    v-model:show={form.visible}
                    preset="dialog"
                    title="创建应用"
                    positive-text="创建应用"
                    negative-text="取消"
                    onPositiveClick={createApp}
                >
                    <n-form label-placement="top">
                        <n-form-item label="应用类型" required>
                            <n-select placeholder="请选择应用类型" options={chunkOptions.value.typeOptions} v-model:value={form.type} />
                        </n-form-item>
                        <n-form-item label="备注">
                            <n-input placeholder="选填" v-model:value={form.remark} />
                        </n-form-item>
                    </n-form>
                </n-modal>
            </div>
        )
    }
})
</script>
