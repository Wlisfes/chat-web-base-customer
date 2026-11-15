<script lang="tsx">
import { defineComponent, computed, CSSProperties } from 'vue'
import { useVModels } from '@vueuse/core'
import * as utils from '@/utils'

export default defineComponent({
    name: 'CommonDialogProvider',
    emits: ['update:visible', 'update:initialize', 'update:loading', 'close', 'cancel', 'submit'],
    props: {
        /**开启弹窗**/
        visible: { type: Boolean, default: false },
        /**按钮加载状态**/
        loading: { type: Boolean, default: false },
        /**初始化中**/
        initialize: { type: Boolean, default: false },
        /**透明度**/
        opacity: { type: Number, default: 0.1 },
        /**弹窗宽度**/
        width: { type: [String, Number], default: '640px' },
        /**弹窗容器额外样式**/
        className: { type: String, default: '' },
        /**根节点容器额外样式**/
        classElement: { type: String, default: '' },
        /**开启滚动容器**/
        scrollbar: { type: Boolean, default: true },
        /**开启底部按钮**/
        action: { type: Boolean, default: true },
        /**取消按钮文案**/
        cancel: { type: String, default: '取消' },
        /**确定按钮文案**/
        submit: { type: String, default: '确定' }
    },
    setup(props, { emit, slots }) {
        const { visible, initialize, loading } = useVModels(props, emit)
        const styleNodes = computed<CSSProperties>(() => ({
            width: utils.isString(props.width) ? props.width : props.width + 'px',
            'max-height': '80vh',
            '--n-font-size': '15px',
            '--n-padding': '0',
            '--n-close-margin': '16px 16px 0 0',
            '--n-icon-margin': '0',
            '--n-content-margin': '0'
        }))

        return () => (
            <n-modal
                draggable
                preset="dialog"
                type="success"
                auto-focus={false}
                mask-closable={false}
                show-icon={false}
                show={visible.value}
                style={styleNodes.value}
                class={`flex flex-col ${props.className}`}
                content-class="flex flex-col flex-1 overflow-hidden"
                title-class="text-20! line-height-28 gap-8 select-none p-inline-20! p-block-20!"
                on-update:show={(show: boolean) => (visible.value = show)}
                on-after-leave={() => emit('close')}
            >
                {{
                    action: () => {
                        return !props.action ? null : (
                            <common-base-element class="w-full flex justify-center gap-12 p-inline-20 p-block-20">
                                {props.cancel && (
                                    <n-button class="min-w-80" size="medium" secondary focusable={false} onClick={() => emit('cancel')}>
                                        {props.cancel}
                                    </n-button>
                                )}
                                {props.submit && (
                                    <n-button
                                        class="min-w-80"
                                        size="medium"
                                        type="primary"
                                        focusable={false}
                                        disabled={loading.value || initialize.value}
                                        loading={loading.value}
                                        onClick={() => emit('submit')}
                                    >
                                        {props.submit}
                                    </n-button>
                                )}
                            </common-base-element>
                        )
                    },
                    default: () => (
                        <n-spin
                            size="large"
                            class="flex flex-col flex-1 overflow-hidden"
                            content-class="flex flex-col flex-1 overflow-hidden"
                            style={{ '--n-opacity-spinning': props.opacity }}
                            show={initialize.value}
                        >
                            {props.scrollbar ? (
                                <n-scrollbar class="flex flex-col flex-1" content-class="min-h-full flex flex-col" trigger="none">
                                    <common-base-element class={`flex flex-col flex-1 p-inline-20 ${props.classElement}`}>
                                        {slots.default && slots.default()}
                                    </common-base-element>
                                </n-scrollbar>
                            ) : (
                                <common-base-element class={`flex flex-col flex-1 overflow-hidden ${props.classElement}`}>
                                    {slots.default && slots.default()}
                                </common-base-element>
                            )}
                        </n-spin>
                    )
                }}
            </n-modal>
        )
    }
})
</script>
