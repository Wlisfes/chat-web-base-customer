<script lang="tsx">
import { defineComponent, h } from 'vue'
import { Chat, Settings } from '@vicons/carbon'
import { useChunkService, useColumnService } from '@/hooks'
import { useGlobal, useStore } from '@/store'
import { fetchNotifyService } from '@/plugins'
import * as Service from '@/api'

export default defineComponent({
    name: 'WebSmsTemplate',
    setup() {
        const { faseUser } = useStore(useGlobal)
        const { chunkOptions } = useChunkService(() => Service.httpBaseSmsAppEnums(), {
            immediate: true
        })
        const { formRef, state, formState, fetchRefresh } = useColumnService(
            (base, payload) => Service.httpBaseSmsColumnApp({ ...payload, page: base.page, size: base.size }),
            { formState: { vague: undefined } }
        )

        return () => (
            <common-base-element class="flex flex-col absolute inset-0 overflow-hidden">
                <common-database-search
                    is-white
                    form-class="p-inline-20"
                    ref={formRef}
                    label-width={85}
                    v-model:loading={state.loading}
                    v-model:when={state.when}
                    v-model:database={state.database}
                    v-model:formState={formState.value}
                >
                    <common-base-header class="p-inline-20 p-block-16 justify-between" title="短信模板">
                        <common-base-button type="primary" tertiary>
                            添加模板
                        </common-base-button>
                    </common-base-header>
                    <common-database-search-column disabled prop="msgId" label="消息ID">
                        <form-base-input
                            clearable
                            placeholder="请输入消息ID"
                            v-model:value={formState.value.msgId}
                            on-submit={fetchRefresh}
                        ></form-base-input>
                    </common-database-search-column>
                </common-database-search>
                {/* <div class="flex items-center justify-between gap-16 p-inline-20 p-block-20 max-[760px]:flex-col max-[760px]:items-stretch">
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
                    </div> */}
            </common-base-element>
        )
    }
})
</script>
