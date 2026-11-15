<script lang="tsx">
import { defineComponent, computed, nextTick, PropType, VNode } from 'vue'
import { moment, isNotEmpty, isEmpty, fetchShortcuts } from '@/utils'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseDatePicker',
    emits: ['update:startTime', 'update:endTime', 'update:value', '-change:value'],
    props: {
        /**Date Picker 的类型**/
        type: { type: String as PropType<string | 'daterange' | 'datetimerange'>, default: 'daterange' },
        /**开始时间**/
        startTime: { type: [String, Number] },
        /**结束时间**/
        endTime: { type: [String, Number] },
        /**自定义图标**/
        dateIcon: { type: Object as PropType<VNode> },
        /**加载状态**/
        loading: { type: Boolean, default: false },
        /**快捷方式**/
        functions: { type: Array as PropType<Array<'近1小时' | '近3小时' | '近24小时' | '近3天' | '近7天' | '近30天'>>, default: () => [] }
    },
    setup(props, { emit, slots }) {
        const { startTime, endTime } = useVModels(props, emit)

        /**按 functions 生成面板快捷项；未传入时不展示。开始时间按当前时刻或自然日回推，结束时间统一为当天 23:59:59。**/
        const shortcuts = computed(() => {
            return props.functions.length === 0 ? undefined : fetchShortcuts(props.functions)
        })

        /**时间组合模式**/
        const rangeTime = computed(() => {
            if (isNotEmpty(startTime.value) && isNotEmpty(endTime.value)) {
                return [moment(startTime.value).valueOf(), moment(endTime.value).valueOf()]
            }
            return null
        })

        /**时间组合模式变更**/
        async function fetchRangeUpdate(e: any, [a, b]: Array<string>) {
            if (isNotEmpty(a) && isNotEmpty(b)) {
                startTime.value = a
                endTime.value = b
            } else {
                startTime.value = null as never
                endTime.value = null as never
            }
            return await nextTick().then(() => {
                return emit('-change:value', { startTime: startTime.value, endTime: endTime.value })
            })
        }

        return () => {
            if (isNotEmpty(props.type) && props.type.includes('range')) {
                return (
                    <n-date-picker
                        class="form-base-date-picker w-full"
                        type={props.type}
                        value={rangeTime.value}
                        default-time={props.type.includes('time') ? ['00:00:00', '23:59:59'] : undefined}
                        shortcuts={shortcuts.value}
                        on-update:value={fetchRangeUpdate}
                    ></n-date-picker>
                )
            }
            return (
                <n-date-picker class="form-base-date-picker w-full" type={props.type}>
                    {{
                        'date-icon': () => (
                            <common-internal-loading
                                class="form-base-date-picker__loading"
                                stroke-width={24}
                                scale={0.85}
                                show={props.loading}
                            >
                                {isEmpty(props.dateIcon) ? <common-internal-date-icon></common-internal-date-icon> : props.dateIcon}
                            </common-internal-loading>
                        )
                    }}
                </n-date-picker>
            )
        }
    }
})
</script>

<style lang="scss" scoped>
/**仅加载动画沿用输入框 loading 的颜色变量，默认日期图标保持 naive-ui 原有图标颜色**/
.form-base-date-picker :deep(.form-base-date-picker__loading .common-internal-loading__wrapper) {
    color: var(--n-loading-color);
}
</style>
