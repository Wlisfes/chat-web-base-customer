<script lang="tsx">
import { defineComponent, Fragment } from 'vue'

export default defineComponent({
    name: 'CommonSkeletonProvider',
    props: {
        /**骨架屏组件样式**/
        className: { type: String, default: '' },
        /**开启背景色**/
        isWhite: { type: Boolean, default: false },
        /**线索骨架屏**/
        loading: { type: Boolean, default: false }
    },
    setup(props, { slots }) {
        return () => (
            <Fragment>
                {props.loading ? (
                    <common-base-element is-white={props.isWhite} class={`common-skeleton-provider ${props.className}`}>
                        {slots.default && slots.default()}
                    </common-base-element>
                ) : (
                    <Fragment>{slots.render && slots.render()}</Fragment>
                )}
            </Fragment>
        )
    }
})
</script>
