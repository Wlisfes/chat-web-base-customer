<script lang="tsx">
import { computed, defineComponent, PropType, CSSProperties } from 'vue'
import { isEmpty, isCommonBaseChunkType, fetchChunkOption, fetchChunkOptionPath, fetchChunkType, fetchChunkColor } from '@/utils'
import { type CommonBaseChunkType } from '@/utils'
import { useThemeVars } from 'naive-ui'
import { useMouse, useStore } from '@/store'

export default defineComponent({
    name: 'CommonBaseChunk',
    props: {
        /**内容超长时是否显示tooltip**/
        ellipsis: { type: Boolean, default: false },
        /**渲染模式：标签或纯文本**/
        mode: { type: String as PropType<'chunk' | 'text'>, default: 'chunk' },
        /**是否显示边框，对应 n-tag 的 bordered**/
        bordered: { type: Boolean, default: false },
        /**显示内容**/
        value: { type: [Number, String] },
        /**value为空时显示内容**/
        empty: { type: [Number, String], default: '-' },
        /**枚举选项列表，按 value 匹配出 label 与 type；支持 children 树形结构**/
        items: { type: Array as PropType<Array<Omix>>, default: () => [] },
        /**树形枚举是否回显父级路径，开启后展示为“父级 / 子级”**/
        showPath: { type: Boolean, default: false },
        /**父级路径分隔符**/
        separator: { type: String, default: ' / ' },
        /**颜色类型，Naive 主题色或自定义色板**/
        type: {
            type: String as PropType<CommonBaseChunkType>,
            default: 'default',
            validator: (value: string) => isCommonBaseChunkType(value)
        }
    },
    setup(props, { slots }) {
        const { inverted } = useStore(useMouse)
        const vars = useThemeVars()
        /**优先使用枚举选项的颜色类型，其次回退到显式传入的 type**/
        const chunkType = computed(() => fetchChunkType(props.value, props.items, props.type))
        /**优先展示枚举选项的中文名称，其次回退到原始值**/
        const chunkLabel = computed(() => {
            if (isEmpty(props.value)) {
                return props.empty
            }
            if (props.showPath) {
                const path = fetchChunkOptionPath(props.value, props.items)
                return path.length > 0 ? path.map(item => item.label).join(props.separator) : props.value
            }
            return fetchChunkOption(props.value, props.items)?.label ?? props.value ?? '-'
        })
        const chunkStyle = computed<CSSProperties>(() => {
            return {
                '--n-height': '24px',
                '--n-font-size': '14px',
                '--chunk-color': fetchChunkColor(chunkType.value, vars.value, inverted.value)
            } as CSSProperties
        })
        const chunkClass = computed(() => ['common-base-chunk', `is-${chunkType.value}`, `is-${props.mode}`])

        return () => {
            if (['chunk'].includes(props.mode)) {
                return (
                    <n-tag class={chunkClass.value} style={chunkStyle.value} bordered={props.bordered} type="default">
                        {slots.default ? slots.default() : chunkLabel.value}
                    </n-tag>
                )
            } else if (props.ellipsis) {
                return (
                    <n-performant-ellipsis
                        tooltip={{
                            scrollable: true,
                            placement: 'top',
                            style: { maxWidth: 'min(640px, 90vw)', maxHeight: 'min(640px, 45vh)', wordBreak: 'break-all' }
                        }}
                    >
                        {{
                            tooltip: () => chunkLabel.value,
                            default: () => (slots.default ? slots.default(chunkLabel.value) : chunkLabel.value)
                        }}
                    </n-performant-ellipsis>
                )
            }
            return (
                <n-text class={chunkClass.value} style={chunkStyle.value}>
                    {slots.default ? slots.default(chunkLabel.value) : chunkLabel.value}
                </n-text>
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.common-base-chunk {
    &.is-text {
        padding: 0;
        background-color: transparent;
        color: var(--chunk-color);
    }
    &.is-chunk {
        --n-text-color: var(--chunk-color) !important;
        --n-color: color-mix(in srgb, var(--chunk-color) 12%, transparent) !important;
        --n-border: 1px solid color-mix(in srgb, var(--chunk-color) 30%, transparent) !important;
    }
}
</style>
