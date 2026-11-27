<script lang="tsx">
import { defineComponent, computed, PropType, VNode } from 'vue'
import { isNotEmpty } from '@/utils'
import { useMouse, useStore } from '@/store'

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
        /**悬浮抬起并加深阴影**/
        isHover: { type: Boolean, default: false },
        /**是否开启空节点过滤、常用于权限根节点**/
        abstract: { type: Boolean, default: false },
        /**空节点内容**/
        empty: { type: [Number, String, Object] as PropType<string | number | VNode> }
    },
    setup(props, { slots }) {
        const { inverted } = useStore(useMouse)
        const className = computed(() => ({
            [`common-base-element ${props.className}`]: true,
            'is-white': props.isWhite,
            'is-border': props.isBorder,
            'is-hover': props.isHover,
            'is-dark': inverted.value
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
        background-color 0.3s var(--n-bezier),
        box-shadow 0.3s var(--n-bezier),
        transform 0.3s var(--n-bezier);
    &.is-white {
        background-color: var(--card-color);
    }
    &.is-border {
        border: 1px solid var(--divider-color);
        border-radius: var(--border-radius);
    }
    &.is-hover {
        box-shadow: 0 1px 2px rgb(34 37 45 / 6%);
        &:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow:
                0 4px 12px rgb(34 37 45 / 6%),
                0 12px 28px rgb(34 37 45 / 8%);
        }
        &.is-dark {
            box-shadow: 0 1px 2px rgb(0 0 0 / 28%);
            &:hover {
                box-shadow:
                    0 4px 12px rgb(0 0 0 / 44%),
                    0 12px 32px rgb(0 0 0 / 56%);
            }
        }
    }
}
</style>
