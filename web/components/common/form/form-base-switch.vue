<script lang="tsx">
import { defineComponent, nextTick, PropType, VNode } from 'vue'
import { fetchWherer, isNotEmpty } from '@/utils'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseSwitch',
    emits: ['update:value', '-change:value'],
    props: {
        /**绑定数据**/
        value: { type: [Number, String, Boolean] },
        /**开关激活时的内容**/
        checked: { type: [Object, String] as PropType<string | VNode> },
        /**开关关闭时的内容**/
        unchecked: { type: [Object, String] as PropType<string | VNode> }
    },
    setup(props, { emit, slots }) {
        const { value } = useVModels(props, emit)

        async function fetchUpdate(vague: typeof props.value) {
            return await nextTick(() => (value.value = vague)).then(() => {
                return emit('-change:value', value.value)
            })
        }

        return () => (
            <n-switch class="form-base-switch" v-model:value={value.value} onUpdate:value={fetchUpdate}>
                {{
                    checked: fetchWherer(isNotEmpty(slots.checked) || isNotEmpty(props.checked), () => {
                        return slots.prefix ? slots.prefix() : props.checked
                    }),
                    unchecked: fetchWherer(isNotEmpty(slots.unchecked) || isNotEmpty(props.unchecked), () => {
                        return slots.suffix ? slots.suffix() : props.checked
                    })
                }}
            </n-switch>
        )
    }
})
</script>
