<script lang="tsx">
import { defineComponent, computed, PropType } from 'vue'
import { isEmpty } from 'class-validator'

export default defineComponent({
    name: 'CommonDatabaseSearchColumn',
    props: {
        /**列字段**/
        prop: { type: String, required: true },
        /**单位格数量**/
        span: { type: Number, default: 1 },
        /**禁止取消、固定展示**/
        disabled: { type: Boolean, default: false },
        /**默认显示状态**/
        check: { type: Boolean, default: true },
        /**描述**/
        label: { type: String },
        /**搜索栏字段自定义排版规则**/
        database: { type: Array as PropType<Array<Omix>>, default: () => [] }
    },
    setup(props, { emit, slots }) {
        const check = computed(() => {
            const node = props.database.find(item => item.prop === props.prop) ?? {}
            if (props.database.length === 0 || isEmpty(node.check)) {
                return true
            }
            return node.check
        })

        return () => {
            if (!check.value) {
                return null
            }
            return (
                <form-base-column
                    class={`common-database-search-column ${props.span > 1 ? 'grid-col-span-2' : 'grid-col-span-1'}`}
                    show-feedback={false}
                    prop={props.prop}
                    check={props.check}
                    label={props.label}
                >
                    {slots.default && slots.default()}
                </form-base-column>
            )
        }
    }
})
</script>
