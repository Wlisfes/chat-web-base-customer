<script lang="tsx">
import { defineComponent, computed, PropType, VNode } from 'vue'
import { isNotEmpty } from '@/utils'

export default defineComponent({
    name: 'CommonBaseElement',
    props: {
        /**边距控制**/
        wrap: { type: String, default: '' },
        /**额外样式**/
        className: { type: String, default: '' },
        /**开启背景色**/
        isWhite: { type: Boolean, default: false },
        /**开启边框**/
        isBorder: { type: Boolean, default: false },
        /**是否开启空节点过滤、常用于权限根节点**/
        abstract: { type: Boolean, default: false },
        /**空节点内容**/
        empty: { type: [Number, String, Object] as PropType<string | number | VNode> }
    },
    setup(props, { slots }) {
        const className = computed(() => ({
            [`common-base-element ${props.className}`]: true,
            'is-white': props.isWhite,
            'is-border': props.isBorder
        }))

        return () => {
            if (props.abstract) {
                const vnode = slots.default?.() ?? []
                return vnode.length === 0 ? props.empty : <n-element class={className.value}>{vnode}</n-element>
            } else if (isNotEmpty(props.wrap.trimStart().trimEnd())) {
                return (
                    <div class={props.wrap}>
                        <n-element class={className.value}>{slots.default && slots.default()}</n-element>
                    </div>
                )
            }
            return <n-element class={className.value}>{slots.default && slots.default()}</n-element>
        }
    }
})
</script>

<style lang="scss" scoped>
.common-base-element {
    box-sizing: border-box;
    transition:
        color 0.3s var(--n-bezier),
        border-color 0.3s var(--n-bezier),
        background-color 0.3s var(--n-bezier);
    &.is-white {
        background-color: var(--card-color);
    }
    &.is-border {
        border: 1px solid var(--divider-color);
        border-radius: var(--border-radius);
    }
}
</style>
