<script lang="tsx">
import { defineComponent, ref, Ref, reactive, inject, toRefs, onMounted, onUnmounted } from 'vue'
import { nextTick, computed, PropType, CSSProperties, VNode } from 'vue'
import { FormInst, FormItemInst } from 'naive-ui'
import { isEmpty, isNotEmpty } from '@/utils'
import { HelpFilled } from '@vicons/carbon'
import { useVModels } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'

export default defineComponent({
    name: 'FormBaseColumn',
    emits: ['update:value'],
    props: {
        /**字段值**/
        value: { type: [Number, String, Boolean, Object, Array] as PropType<any>, default: () => undefined },
        /**占满一行**/
        full: { type: Boolean, default: false },
        /**占据栅格列数（如 2 表示占两列）**/
        span: { type: Number, default: undefined },
        /**标签信息**/
        label: { type: [String, Object] as PropType<string | VNode> },
        /**提示信息**/
        tooltip: { type: [String, Object] as PropType<string | VNode> }
    },
    setup(props, { emit, slots }) {
        const { value } = useVModels(props, emit)
        const initialValue = ref<any>(cloneDeep(props.value))
        const element = ref() as Ref<Omix<FormItemInst>>
        /**获取formRef实例**/
        const formRef = inject('FORM_BASE_INSTANCE', ref({} as Omix<FormInst>))
        /**字段重置**/
        function restore() {
            value.value = initialValue.value ?? null
            return element.value?.restoreValidation()
        }

        /**父级栅格当前列数（auto-fit 布局随宽度变化）**/
        const gridColumns = ref(0)
        let observer: ResizeObserver | undefined
        function measureColumns() {
            const parent = (element.value as any)?.$el?.parentElement as HTMLElement | undefined
            if (!parent) return
            const template = getComputedStyle(parent).gridTemplateColumns
            gridColumns.value = template && template !== 'none' ? template.split(' ').filter(Boolean).length : 0
        }
        /**
         * 栅格占位
         * - full：占满整行
         * - span：占据指定列数；当前列数不足时占满整行，避免产生隐式列撑破布局
         * 标签高度和间距只在 label-placement 为 top 时压缩，左右布局保持 Naive UI 默认样式。
         */ //prettier-ignore
        const columnStyle = computed<CSSProperties>(() => {
            const baseStyle: CSSProperties = !['top'].includes(formRef.value.labelPlacement) ? {} : {
                '--n-label-height': '22px',
                '--n-label-padding': '0 0 2px 2px',
                '--n-feedback-padding': '2px 0 0 2px',
                '--n-feedback-height': '22px',
                '--n-arrow-offset': '5px',
            }
            if (props.full) {
                return { ...baseStyle, gridColumn: '1 / -1' }
            }
            if (!props.span || props.span <= 1) {
                return baseStyle
            }
            if (gridColumns.value && gridColumns.value <= props.span) {
                return { ...baseStyle, gridColumn: '1 / -1', minWidth: 0 }
            }
            return { ...baseStyle, gridColumn: `span ${props.span}`, minWidth: 0 }
        })
        onMounted(() => {
            if (!props.span || props.span <= 1) return
            nextTick(() => {
                measureColumns()
                const parent = (element.value as any)?.$el?.parentElement as HTMLElement | undefined
                if (parent && typeof ResizeObserver !== 'undefined') {
                    observer = new ResizeObserver(measureColumns)
                    observer.observe(parent)
                }
            })
        })
        onUnmounted(() => observer?.disconnect())

        /**实例上下文组合**/
        const context = reactive({ ...toRefs(props), restore })
        onUnmounted(() => formRef.value.remove(context))
        onMounted(async () => {
            return await nextTick().then(async () => {
                if (formRef.value.insert) {
                    return await formRef.value.insert(context)
                }
            })
        })

        /**label插槽**/
        function fetchLabelRneder() {
            if (isNotEmpty(props.label) && isNotEmpty(props.tooltip)) {
                return (
                    <div class="flex-inline items-center line-height-16 overflow-hidden">
                        {props.label}
                        <n-tooltip trigger="hover" placement="top-start" style={{ maxWidth: '320px' }}>
                            {{
                                default: () => props.tooltip,
                                trigger: () => (
                                    <div class="flex items-center p-is-5 overflow-hidden">
                                        <n-icon size={16} color="var(--text-color-3)">
                                            <HelpFilled />
                                        </n-icon>
                                    </div>
                                )
                            }}
                        </n-tooltip>
                    </div>
                )
            }
            return props.label
        }

        return () => (
            <n-form-item ref={element} class={{ 'form-base-column': true, 'w-full': props.full }} style={columnStyle.value}>
                {{
                    default: slots.default,
                    label: isEmpty(props.label) && isEmpty(slots.label) ? undefined : fetchLabelRneder
                }}
            </n-form-item>
        )
    }
})
</script>
