<script lang="tsx">
import { defineComponent, nextTick } from 'vue'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseCascader',
    emits: ['update:value', '-change:value'],
    props: {
        /**开启多选**/
        multiple: { type: Boolean, default: false },
        /**多选标签的最大显示数量**/
        maxTagCount: { type: String, default: 'responsive' },
        /**绑定数据**/
        value: { type: [Number, String, Array] },
        /**选项label的字段名**/
        labelField: { type: String, default: 'label' },
        /**选项 value 的字段名**/
        valueField: { type: String, default: 'value' },
        /**选项children的字段名**/
        childrenField: { type: String, default: 'children' },
        /**加载状态：n-cascader 不支持 loading，通过 arrow 插槽渲染与 n-select 一致的加载动画**/
        loading: { type: Boolean, default: false }
    },
    setup(props, { emit }) {
        const { value } = useVModels(props, emit)

        async function fetchUpdate(vague: string, e: Omix, p: any) {
            return await nextTick(() => (value.value = vague)).then(() => {
                return emit('-change:value', value.value, e, p)
            })
        }

        return () => (
            <n-cascader
                class={{ 'form-base-cascader': true, 'is-multiple': props.multiple }}
                multiple={props.multiple}
                max-tag-count={props.maxTagCount}
                label-field={props.labelField}
                value-field={props.valueField}
                children-field={props.childrenField}
                v-model:value={value.value}
                on-update:value={fetchUpdate}
            >
                {{
                    arrow: () => (
                        <common-internal-loading class="form-base-cascader__loading" stroke-width={24} scale={0.85} show={props.loading}>
                            <common-internal-chevron-down></common-internal-chevron-down>
                        </common-internal-loading>
                    )
                }}
            </n-cascader>
        )
    }
})
</script>

<style lang="scss" scoped>
/**加载动画沿用选择框 loading 的颜色变量，箭头保持 naive-ui 原有颜色**/
.form-base-cascader :deep(.form-base-cascader__loading .common-internal-loading__wrapper) {
    color: var(--n-loading-color);
}
.form-base-cascader {
    :deep(.n-tag) {
        --n-height: 26px;
    }
}
</style>
