<script lang="tsx">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'CommonBaseScrollbar',
    props: {
        /**滚动容器类名**/
        className: { type: String, default: '' },
        /**开启根节点容器**/
        element: { type: Boolean, default: false },
        /**滚动容器根节点属性**/
        elementProps: { type: Object as PropType<Omix>, default: () => ({}) }
    },
    setup(props, { slots }) {
        return () => (
            <n-scrollbar
                class="common-base-scrollbar flex-1 overflow-hidden"
                content-class={`min-h-full flex flex-col ${props.className}`}
                trigger="none"
            >
                {props.element ? (
                    <common-base-element {...props.elementProps}>{slots.default && slots.default()}</common-base-element>
                ) : (
                    slots.default && slots.default()
                )}
            </n-scrollbar>
        )
    }
})
</script>

<style lang="scss" scoped>
.common-base-scrollbar {
    :deep(.n-scrollbar-rail__scrollbar) {
        z-index: 99;
    }
}
</style>
