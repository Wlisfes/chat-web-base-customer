<script lang="tsx">
import { defineComponent, computed, CSSProperties } from 'vue'
import { isNotEmpty, isString } from '@/utils'

export default defineComponent({
    name: 'CommonSkeletonBlock',
    props: {
        /**是否显示初始化**/
        initialize: { type: Boolean, default: true },
        /**左右边距**/
        inline: { type: [String, Number] },
        /**上下边距**/
        block: { type: [String, Number] },
        /**样式高度**/
        height: { type: [String, Number] },
        /**额外的类名**/
        className: { type: String, default: '' },
        /**内容节点的类名**/
        elementClass: { type: String, default: '' },
        /**是否显示为直角骨架**/
        sharp: { type: Boolean, default: false },
        /**是否显示为圆形骨架**/
        circle: { type: Boolean, default: false },
        /**是否显示为圆角骨架**/
        round: { type: Boolean, default: false }
    },
    setup(props, { slots }) {
        const root = computed<CSSProperties>(() => {
            const obs: CSSProperties = {}
            if (isNotEmpty(props.height)) {
                obs.height = isString(props.height) ? props.height : `${props.height}px`
            }
            return obs
        })
        const style = computed<CSSProperties>(() => {
            const obs: CSSProperties = {}
            if (isNotEmpty(props.block)) {
                obs.paddingBlockStart = isString(props.block) ? props.block : `${props.block}px`
                obs.paddingBlockEnd = isString(props.block) ? props.block : `${props.block}px`
            }
            if (isNotEmpty(props.inline)) {
                obs.paddingInlineStart = isString(props.inline) ? props.inline : `${props.inline}px`
                obs.paddingInlineEnd = isString(props.inline) ? props.inline : `${props.inline}px`
            }
            return obs
        })

        return () => (
            <n-element class="common-skeleton-block relative box-border line-height-22">
                <div
                    style={{ ...root.value, ...style.value }}
                    class={[`flex flex-col box-border ${props.elementClass}`, { 'opacity-0 pointer-events-none': props.initialize }]}
                >
                    {slots.default && slots.default()}
                </div>
                {props.initialize && (
                    <div
                        style={style.value}
                        class={`flex flex-col absolute inset-0 w-full h-full overflow-hidden box-border ${props.className}`}
                    >
                        <n-skeleton class="w-full h-full" sharp={props.sharp} circle={props.circle} round={props.round} />
                    </div>
                )}
            </n-element>
        )
    }
})
</script>
