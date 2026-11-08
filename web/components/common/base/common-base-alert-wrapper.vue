<script lang="tsx">
import { computed, defineComponent, PropType, CSSProperties } from 'vue'
import { useThemeVars } from 'naive-ui'
import { isNaiveChunkType, isCommonBaseChunkType, fetchChunkType, fetchChunkColor, CommonBaseChunkType } from '@/utils'
import { useMouse, useStore } from '@/store'

export default defineComponent({
    name: 'CommonBaseAlertWrapper',
    props: {
        /**是否显示边框**/
        bordered: { type: Boolean, default: true },
        /**是否显示图标**/
        showIcon: { type: Boolean, default: false },
        /**是否可关闭**/
        closable: { type: Boolean, default: false },
        /**枚举值，配合 items 自动匹配颜色类型**/
        value: { type: [Number, String] },
        /**枚举选项列表，按 value 匹配 type**/
        items: { type: Array as PropType<Array<Omix>>, default: () => [] },
        /**颜色类型，与 common-base-chunk 保持一致：Naive 主题色或自定义色板**/
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
        const alertType = computed(() => fetchChunkType(props.value, props.items, props.type))
        /**default 与 Naive 主题色交给 n-alert 原生样式；其余自定义色板通过 CSS 变量覆盖**/
        const isCustom = computed(() => !isNaiveChunkType(alertType.value) && alertType.value !== 'default')
        const alertStyle = computed<CSSProperties | undefined>(() => {
            if (!isCustom.value) {
                return undefined
            }
            return { '--alert-color': fetchChunkColor(alertType.value, vars.value, inverted.value) } as CSSProperties
        })

        return () => (
            <n-alert
                class={['common-base-alert-wrapper', { 'is-custom': isCustom.value }]}
                style={alertStyle.value}
                type={isNaiveChunkType(alertType.value) ? alertType.value : 'default'}
                closable={props.closable}
                bordered={props.bordered}
                show-icon={props.showIcon}
            >
                {slots.default && slots.default()}
            </n-alert>
        )
    }
})
</script>

<style lang="scss" scoped>
.common-base-alert-wrapper.n-alert {
    display: flex;
    flex-direction: column;
    :deep(.n-alert-body),
    :deep(.n-alert-body__content) {
        flex-direction: column;
        display: flex;
        flex: 1;
        padding: 0;
    }
    &.n-alert--closable :deep(.n-alert-body) {
        margin-right: calc(var(--n-close-size) + var(--n-padding));
    }
    &.is-custom {
        --n-icon-color: var(--alert-color) !important;
        --n-title-text-color: var(--alert-color) !important;
        --n-color: color-mix(in srgb, var(--alert-color) 12%, transparent) !important;
        --n-border: 1px solid color-mix(in srgb, var(--alert-color) 30%, transparent) !important;
    }
}
</style>
