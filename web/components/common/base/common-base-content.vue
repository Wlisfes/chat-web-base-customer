<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { isArray, isEmpty, isNotEmpty, isObject } from '@/utils'

export default defineComponent({
    name: 'CommonBaseContent',
    props: {
        /**内容超长时是否显示tooltip**/
        ellipsis: { type: Boolean, default: false },
        /**内容**/
        value: { type: [String, Number, Array] },
        /**列表字段取值**/
        fieldName: { type: String, default: 'name' },
        /**分割符合**/
        bit: { type: String, default: '、' }
    },
    setup(props, { slots }) {
        /**计算显示内容**/
        const displayContent = computed(() => {
            if (isEmpty(props.value) || (isArray(props.value) && props.value.length === 0)) {
                return '-'
            } else if (isArray(props.value)) {
                const items = props.value.map(item => {
                    return isObject(item) ? (item as Omix)[props.fieldName] : item
                })
                const content = items.filter(isNotEmpty).join(props.bit)
                return isEmpty(content) ? '-' : content
            }
            return props.value ?? '-'
        })

        return () => {
            if (props.ellipsis) {
                return (
                    <n-performant-ellipsis
                        tooltip={{
                            scrollable: true,
                            placement: 'top',
                            style: { maxWidth: 'min(640px, 90vw)', maxHeight: 'min(640px, 45vh)', wordBreak: 'break-all' }
                        }}
                    >
                        {{
                            tooltip: () => displayContent.value,
                            default: () => (slots.default ? slots.default(displayContent.value) : displayContent.value)
                        }}
                    </n-performant-ellipsis>
                )
            }
            return slots.default ? slots.default(displayContent.value) : <span>{displayContent.value}</span>
        }
    }
})
</script>
