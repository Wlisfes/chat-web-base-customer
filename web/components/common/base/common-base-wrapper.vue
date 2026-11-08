<script lang="tsx">
import { defineComponent, Fragment } from 'vue'

export default defineComponent({
    name: 'CommonBaseWrapper',
    props: {
        /**容器样式**/
        className: { type: String, default: 'flex flex-col flex-1 overflow-hidden' },
        /**加载状态**/
        loading: { type: Boolean, default: false },
        /**初始化状态**/
        initialize: { type: Boolean, default: false },
        /**加载大小**/
        size: { type: [String, Number], default: 48 },
        /**透明度**/
        opacity: { type: Number, default: 0.5 },
        /**是否使用滚动容器**/
        scrollbar: { type: Boolean, default: false },
        /**滚动容器样式**/
        scrollbarProps: { type: Object, default: () => ({}) }
    },
    setup(props, { slots }) {
        return () => (
            <n-spin
                class={`common-base-wrapper ${props.className}`}
                style={{ '--n-opacity-spinning': props.opacity }}
                content-class="flex flex-col flex-1 overflow-hidden"
                size={props.size}
                show={props.loading}
            >
                {props.initialize ? undefined : (
                    <Fragment>
                        {props.scrollbar ? (
                            <n-scrollbar trigger="none" class="flex-1 overflow-hidden" {...props.scrollbarProps}>
                                {slots.default && slots.default()}
                            </n-scrollbar>
                        ) : (
                            slots.default && slots.default()
                        )}
                    </Fragment>
                )}
            </n-spin>
        )
    }
})
</script>
