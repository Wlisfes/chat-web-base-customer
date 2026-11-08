<script lang="tsx">
import { defineComponent, ref, Ref, computed, PropType, CSSProperties, nextTick } from 'vue'
import { PopoverInst } from 'naive-ui'
import { useVModels } from '@vueuse/core'
import { enter, fetchWherer, isNotEmpty } from '@/utils'

export default defineComponent({
    name: 'CommonBaseAction',
    emits: ['update:initialize', 'update:loading', 'update:vague', 'update:event', 'submit'],
    props: {
        /**组件模式**/
        mode: { type: String as PropType<'input' | 'action'>, default: 'action' },
        /**初始化中**/
        initialize: { type: Boolean, default: true },
        /**加载中**/
        loading: { type: Boolean, default: true },
        /**容器节点样式**/
        className: { type: String, default: 'max-w-520' },
        /**排列布局**/
        cols: { type: Number, default: 1 },
        /**间距**/
        gap: { type: Number, default: 12 },
        /**弹出层最大宽度**/
        maxWidth: { type: String },
        /**弹出层最大高度**/
        maxHeight: { type: String, default: '450px' },
        /**弹出层方向**/
        placement: { type: String, default: 'bottom-start' },
        /**模糊查询关键字**/
        vague: { type: String },
        /**查询事件名称**/
        event: { type: String },
        /**搜索框占位符**/
        placeholder: { type: String },
        /**字符占位宽度**/
        labelWidth: { type: String, default: 'auto' }
    },
    setup(props, { emit, slots }) {
        const instance = ref() as Ref<PopoverInst>
        const { initialize, loading, vague, event } = useVModels(props, emit)
        const elementNodes = computed(() => ({
            width: 'calc(100vw - 20px)',
            maxWidth: fetchWherer(isNotEmpty(props.maxWidth), props.maxWidth, props.cols === 1 ? '450px' : '800px')
        }))
        const formNodes = computed<CSSProperties>(() => ({
            display: 'grid',
            gridTemplateColumns: `repeat(${props.cols === 1 ? 1 : 2}, minmax(0px, 1fr))`,
            gap: `${props.gap}px`
        }))

        /**输入框回车事件**/
        async function fetchKeyup(evt: KeyboardEvent) {
            return enter(evt, async () => {
                return await fetchEvent('input-submit')
            })
        }

        /**事件触发**/
        async function fetchEvent(eventName: 'input-submit' | 'submit') {
            return await nextTick(() => (event.value = eventName)).then(async () => {
                return await emit('submit', { event: eventName })
            })
        }

        /**确定提交**/
        async function fetchSubmit(evt: MouseEvent) {
            return await fetchEvent('submit').then(() => {
                return instance.value.setShow(false)
            })
        }

        return () => (
            <div class={`common-base-action flex flex-1 gap-10 ${props.className}`}>
                {/* <form-base-input
                    v-model:value={vague.value}
                    placeholder={props.placeholder}
                    clearable
                    onKeyup={fetchKeyup}
                ></form-base-input> */}
                {props.mode === 'input' ? (
                    <common-base-button
                        secondary
                        class="min-w-80"
                        type="primary"
                        content="搜索"
                        icon="nest-search"
                        disabled={initialize.value || loading.value}
                        loading={loading.value}
                        onClick={() => fetchEvent('input-submit')}
                    ></common-base-button>
                ) : (
                    <n-popover ref={instance} placement={props.placement} trigger="click" arrow-point-to-center style={{ padding: 0 }}>
                        {{
                            trigger: () => (
                                <common-base-button
                                    secondary
                                    class="min-w-80"
                                    type="primary"
                                    icon="nest-search"
                                    content="筛选"
                                ></common-base-button>
                            ),
                            default: () => (
                                <n-element class="flex flex-col" style={elementNodes.value}>
                                    <n-h1 class="m-0 text-16 line-height-24 p-inline-14 p-block-12">高级筛选</n-h1>
                                    <n-scrollbar style={{ maxHeight: props.maxHeight }}>
                                        <n-form
                                            class="p-inline-14"
                                            style={formNodes.value}
                                            label-width={props.labelWidth}
                                            label-placement="left"
                                            show-feedback={false}
                                        >
                                            {slots.default && slots.default()}
                                        </n-form>
                                    </n-scrollbar>
                                    <n-flex justify="center" class="p-inline-14 p-block-14">
                                        <common-base-button class="min-w-80">重置</common-base-button>
                                        <common-base-button class="min-w-80" type="primary" onClick={fetchSubmit}>
                                            确定
                                        </common-base-button>
                                    </n-flex>
                                </n-element>
                            )
                        }}
                    </n-popover>
                )}
            </div>
        )
    }
})
</script>
