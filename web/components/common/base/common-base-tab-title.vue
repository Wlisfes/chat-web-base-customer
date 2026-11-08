<script lang="tsx">
import { defineComponent, VNode, PropType } from 'vue'
import { isNotEmpty } from '@/utils'

export default defineComponent({
    name: 'CommonBaseTabTitle',
    props: {
        /**开启骨架屏**/
        initialize: { type: Boolean, default: false },
        /**标题**/
        title: { type: String, default: '' },
        /**根节点样式**/
        className: { type: String, default: '' },
        /**图标组件配置**/
        iconProps: { type: Object as PropType<Omix>, default: () => ({}) },
        /**图标组件**/
        icon: { type: [Object, String] as PropType<VNode | String> }
    },
    setup(props) {
        return () => {
            if (props.initialize) {
                return (
                    <common-skeleton-block>
                        <div class={`flex items-center gap-x-5 overflow-hidden ${props.className}`}>
                            {isNotEmpty(props.icon) && (
                                <common-base-icon
                                    component={props.icon}
                                    {...{ size: props.iconProps.size ?? 18, ...props.iconProps }}
                                ></common-base-icon>
                            )}
                            {isNotEmpty(props.title) && <span>{props.title}</span>}
                        </div>
                    </common-skeleton-block>
                )
            }
            return (
                <div class={`flex items-center gap-x-5 overflow-hidden ${props.className}`}>
                    {isNotEmpty(props.icon) && (
                        <common-base-icon
                            component={props.icon}
                            {...{ size: props.iconProps.size ?? 18, ...props.iconProps }}
                        ></common-base-icon>
                    )}
                    {isNotEmpty(props.title) && <span>{props.title}</span>}
                </div>
            )
        }
    }
})
</script>
