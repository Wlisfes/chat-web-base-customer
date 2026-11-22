<script lang="tsx">
import { defineComponent, h, Component } from 'vue'
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
        const { faseUser } = useStore(useGlobal)
        const { chunkOptions } = useChunkService(() => Service.httpBaseSmsAppEnums(), { immediate: true })
        const { formRef, state, formState, fetchRefresh } = useColumnService(
            (base, payload) => Service.httpBaseSmsColumnApp({ ...payload, page: base.page, size: base.size }),
            { formState: { vague: undefined } }
        )

        return () => (
            <common-base-element class="flex flex-col  overflow-hidden">
                <common-base-element is-white>
                    <common-database-search
                        ref={formRef}
                        label-width={85}
                        v-model:loading={state.loading}
                        v-model:when={state.when}
                        v-model:database={state.database}
                        v-model:formState={formState.value}
                    >
                        <common-base-header
                            class="p-inline-20 p-block-20 justify-between"
                            title="短信应用管理"
                            document="创建或修改应用请联系商务人员或在线客服，您可以选择一个应用进行发送短信。"
                        ></common-base-header>
                    </common-database-search>
                </common-base-element>
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
                            </div>
                        </common-base-element>
                    ))}
                    <common-base-element class="p-14 flex flex-col gap-y-5 h-217 items-center justify-center" is-white is-border>
                        <common-base-button text type="primary">
                            <common-base-icon size={18} name="nest-plus"></common-base-icon>
                            <span class="text-16 p-is-5">添加应用</span>
                        </common-base-button>
                        <n-text depth={3}>
                            已添加应用数：{state.total}，还可添加应用数：{(faseUser.value.config?.smsAppLimit ?? 0) - state.total}
                        </n-text>
                    </common-base-element>
                </common-base-columns-template>
            </common-base-element>
        )
    }
})
</script>
