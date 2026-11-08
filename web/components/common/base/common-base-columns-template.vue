<script lang="tsx">
import { defineComponent, computed, PropType, CSSProperties } from 'vue'

export default defineComponent({
    name: 'CommonBaseColumnsTemplate',
    props: {
        /**类型**/
        type: { type: String as PropType<'fixed' | 'auto-fill' | 'auto-fit'>, default: 'fixed' },
        /**列/宽度**/
        number: { type: Number, required: true }
    },
    setup(props, { slots }) {
        const elementStyle = computed<CSSProperties>(() => {
            if (['auto-fit', 'auto-fill'].includes(props.type)) {
                return { gridTemplateColumns: `repeat(${props.type}, minmax(${props.number ?? 0}px, 1fr))` }
            }
            return { gridTemplateColumns: `repeat(${props.number ?? 1}, minmax(0px, 1fr))` }
        })

        return () => (
            <common-base-element class="common-base-columns-template grid" style={elementStyle.value}>
                {slots.default && slots.default()}
            </common-base-element>
        )
    }
})
</script>
