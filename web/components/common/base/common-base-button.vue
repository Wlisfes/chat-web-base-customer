<script lang="tsx">
import { computed, defineComponent, h, PropType, VNode } from 'vue'
import { useMouse, useStore } from '@/store'
import * as utils from '@/utils'

export default defineComponent({
    name: 'CommonBaseButton',
    emits: ['click'],
    props: {
        /**是否表格操作按钮**/
        database: { type: Boolean, default: false },
        /**图标名称、图标节点**/
        icon: { type: [String, Object] as PropType<string | VNode> },
        /**图标size**/
        iconSize: { type: Number, default: 18 },
        /**按钮文案**/
        content: { type: [String, Object] as PropType<string | VNode> },
        /**操作回调函数**/
        setState: { type: Function as PropType<(e: Omix) => Promise<Omix>>, default: Function },
        /**
         * 按钮颜色类型：兼容 Naive 原生 default、tertiary、primary、info、success、warning、error，
         * 并扩展 common-base-chunk 的自定义色板 red、volcano、orange、lime、green、cyan、blue、geekblue、purple、pink。
         * 自定义色板通过 Naive 的 color 属性着色，可与 secondary、tertiary、quaternary、text、ghost、dashed 等模式组合使用。
         */
        type: {
            type: String as PropType<utils.CommonBaseButtonType>,
            default: 'default',
            validator: (value: string) => utils.isCommonBaseButtonType(value)
        }
    },
    setup(props, { emit, slots }) {
        const { inverted } = useStore(useMouse)
        /**
         * 透传给 n-button 的颜色属性：原生类型直接透传 type；自定义色板回落为 default 并按亮暗主题注入 color。
         * 调用方显式传入的 color、text-color 作为透传属性优先级更高，保持原有用法不变。
         */
        const buttonColorProps = computed<Omix>(() => {
            if (utils.isCustomChunkType(props.type) && props.type !== 'default') {
                return { type: 'default', color: utils.CUSTOM_CHUNK_COLORS[props.type][inverted.value ? 1 : 0] }
            }
            return { type: props.type }
        })

        /**渲染图标**/
        function fetchIconRender() {
            if (utils.isEmpty(props.icon)) {
                return null
            } else if (utils.isString(props.icon)) {
                return <common-base-icon size={props.iconSize} name={props.icon}></common-base-icon>
            }
            return h(props.icon as VNode)
        }

        function fetchContentRender() {
            return slots.default ? slots.default() : props.content
        }

        return () => (
            <n-button
                {...buttonColorProps.value}
                class={{ 'common-base-button': true, 'element-database': props.database }}
                style={{ '--n-icon-size': props.iconSize + 'px' }}
                focusable={false}
                onClick={(event: MouseEvent) => emit('click', event, { setState: props.setState })}
            >
                {{ icon: utils.isEmpty(props.icon) ? undefined : fetchIconRender, default: fetchContentRender }}
            </n-button>
        )
    }
})
</script>

<style lang="scss" scoped>
.common-base-button.element-database {
    --n-icon-margin: 3px;
}
</style>
