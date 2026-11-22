<script lang="tsx">
import { defineComponent, h, reactive, Fragment, Component } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, ChatBot, ChatLaunch } from '@vicons/carbon'
import { useChunkService, useColumnService } from '@/hooks'
import { useGlobal, useStore } from '@/store'
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
        const { faseUser } = useStore(useGlobal)
        const { chunkOptions } = useChunkService(() => Service.httpBaseSmsAppEnums(), { immediate: true })
        const { formRef, state, formState, fetchRefresh } = useColumnService(
            (base, payload) => Service.httpBaseSmsColumnApp({ ...payload, page: base.page, size: base.size }),
            {
                formState: { appAlias: undefined, status: null },
                immediate: true
            }
        )
        const form = reactive({ visible: false, type: undefined as string | undefined, remark: '' })

        async function createApp() {
            console.log(faseUser.value)
            // if (!form.type) return fetchNotifyService({ type: 'warning', title: '请选择应用类型' })
            // try {
            //     await Service.httpBaseSmsCreateApp({ type: form.type, remark: form.remark || undefined })
            //     form.visible = false
            //     form.type = undefined
            //     form.remark = ''
            //     await fetchNotifyService({ type: 'success', title: '应用已创建' })
            //     return fetchRefresh()
            // } catch (err) {
            //     return fetchNotifyService({ type: 'error', title: err.message })
            // }
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

        return () => (
            <common-base-element class="flex flex-col absolute inset-0 overflow-hidden">
                <common-database-search
                    function-class="justify-end"
                    function={['search', 'restore', 'collapse', 'deploy', 'abstract']}
                    ref={formRef}
                    label-width={85}
                    v-model:loading={state.loading}
                    v-model:when={state.when}
                    v-model:database={state.database}
                    v-model:formState={formState.value}
                    //on-update:database={instOptions.fetchUpdateDatabase}
                    //on-restore={instOptions.fetchRestore}
                    //on-submit={instOptions.fetchRequest}
                >
                    <common-database-search-function abstract class="flex gap-col-10">
                        <common-base-button class="min-w-80" type="primary">
                            新增
                        </common-base-button>
                    </common-database-search-function>
                    <common-database-search-column prop="online" label="在线状态">
                        <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                    </common-database-search-column>
                    <common-database-search-column prop="online" label="在线状态">
                        <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                    </common-database-search-column>
                    <common-database-search-column prop="online" label="在线状态">
                        <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                    </common-database-search-column>
                    <common-database-search-column prop="online" label="在线状态">
                        <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                    </common-database-search-column>
                </common-database-search>
                <common-base-header
                    class="p-inline-20 p-bs-20 justify-between items-end!"
                    title="短信应用管理"
                    document="创建或修改应用请联系商务人员或在线客服，您可以选择一个应用进行发送短信。"
                >
                    {/* <form-base-container
                        label-placement="left"
                        size="medium"
                        ref={formRef}
                        model={formState.value}
                        rules={state.rules}
                        disabled={state.loading}
                    >
                        <common-base-columns-template class="flex-1 gap-14" type="auto-fill" number={240}>
                            <form-base-column label="枚举名称" path="name" show-label={false} show-feedback={false}>
                                <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                            </form-base-column>
                            <form-base-column label="枚举名称" path="name" show-label={false} show-feedback={false}>
                                <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                            </form-base-column>
                            <form-base-column label="枚举名称" path="name" show-label={false} show-feedback={false}>
                                <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                            </form-base-column>
                            <form-base-column label="枚举名称" path="name" show-label={false} show-feedback={false}>
                                <form-base-input v-model:value={formState.value.name} placeholder="搜索应用名称 / 应用ID"></form-base-input>
                            </form-base-column>
                        </common-base-columns-template>
                    </form-base-container> */}
                </common-base-header>
                <common-base-scrollbar>
                    <common-base-columns-template class="gap-14 p-20" type="auto-fill" number={320}>
                        {state.dataSource.map((item: Omix) => (
                            <common-base-element key={item.keyId} is-white is-border>
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
                                        <n-text class="text-16 line-height-24" depth={1}>
                                            {item.appName ?? '-'}
                                        </n-text>
                                        <n-text class="line-height-22" depth={3}>
                                            应用名称
                                        </n-text>
                                    </div>
                                    <div class="m-be-auto flex items-center">
                                        <common-base-chunk value={item.type} items={chunkOptions.value.typeOptions}></common-base-chunk>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-10 p-inline-14 p-be-14 overflow-hidden">
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用ID">
                                        <n-ellipsis tooltip={false}>{item.appId ?? '-'}</n-ellipsis>
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用名称">
                                        <n-ellipsis tooltip={false}>{item.appName ?? '-'}</n-ellipsis>
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="应用状态">
                                        <common-base-chunk value={item.status} items={chunkOptions.value.statusOptions}></common-base-chunk>
                                    </common-base-columns-wrapper>
                                    <common-base-columns-wrapper label-class="w-4.6em m-ie-10" label="备注">
                                        <n-ellipsis tooltip={false}>{item.remark ?? '-'}</n-ellipsis>
                                    </common-base-columns-wrapper>
                                </div>
                            </common-base-element>
                        ))}
                        <common-base-element
                            class="p-14 flex flex-col gap-y-5 h-217 items-center justify-center"
                            is-white
                            is-border
                            onClick={createApp}
                        >
                            <common-base-button text type="primary">
                                <common-base-icon size={18} name="nest-plus"></common-base-icon>
                                <span class="text-16 p-is-5">添加应用</span>
                            </common-base-button>
                            <n-text depth={3}>已添加应用数：{state.total}</n-text>
                        </common-base-element>
                    </common-base-columns-template>
                </common-base-scrollbar>
            </common-base-element>
        )

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
