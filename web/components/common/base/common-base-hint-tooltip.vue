<script lang="tsx">
import { defineComponent, PropType, VNode } from 'vue'
import { HelpFilled } from '@vicons/carbon'

export default defineComponent({
    name: 'CommonBaseHintTooltip',
    props: {
        /**自定义图标**/
        icon: { type: Object as PropType<VNode> },
        /**图标节点样式**/
        className: { type: String, default: '' }
    },
    setup(props, { slots }) {
        return () => (
            <n-tooltip trigger="hover" placement="top" style={{ maxWidth: '320px' }}>
                {{
                    default: slots.default,
                    trigger: () => (
                        <div class={`flex items-center overflow-hidden ${props.className}`}>
                            <n-icon size={16} color="var(--text-color-3)">
                                {props.icon ?? <HelpFilled />}
                            </n-icon>
                        </div>
                    )
                }}
            </n-tooltip>
        )
    }
})
</script>
