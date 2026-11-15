<script lang="tsx">
import { defineComponent, h, nextTick, PropType, VNode } from 'vue'
import { enter, fetchWherer, isNotEmpty } from '@/utils'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseInputNumber',
    emits: ['update:value', '-submit', '-change:value'],
    props: {
        /**绑定数据**/
        value: { type: [Number, String] },
        /**输入框头部内容**/
        prefix: { type: Object as PropType<VNode> },
        /**输入框尾部内容**/
        suffix: { type: Object as PropType<VNode> }
    },
    setup(props, { emit, slots }) {
        const { value } = useVModels(props, emit)

        async function fetchUpdate(vague: string) {
            return await nextTick(() => (value.value = vague)).then(() => {
                return emit('-change:value', value.value)
            })
        }

        async function fetchSubmit(event: KeyboardEvent) {
            return enter(event, async () => {
                return emit('-submit', value.value)
            })
        }

        return () => (
            <n-input-number
                class="form-base-input-number w-full"
                v-model:value={value.value}
                onUpdate:value={fetchUpdate}
                onKeydown={fetchSubmit}
            >
                {{
                    prefix: fetchWherer(isNotEmpty(slots.prefix) || isNotEmpty(props.prefix), () => {
                        return slots.prefix ? slots.prefix() : h(props.prefix as VNode)
                    }),
                    suffix: fetchWherer(isNotEmpty(slots.suffix) || isNotEmpty(props.suffix), () => {
                        return slots.suffix ? slots.suffix() : h(props.suffix as VNode)
                    })
                }}
            </n-input-number>
        )
    }
})
</script>

<style lang="scss" scoped>
.form-base-input-number {
    position: relative;
    :deep(.n-input-wrapper):has(.form-base-switch) {
        --n-padding-right: 3px;
    }
}
</style>
