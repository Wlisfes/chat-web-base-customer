<script lang="tsx">
import { defineComponent, nextTick } from 'vue'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseSelect',
    emits: ['update:value', '-change:value'],
    props: {
        /**开启多选**/
        multiple: { type: Boolean, default: false },
        /**多选标签的最大显示数量**/
        maxTagCount: { type: [String, Number], default: 'responsive' },
        /**绑定数据**/
        value: { type: [Number, String, Array] },
        /**选项label的字段名**/
        labelField: { type: String, default: 'label' },
        /**选项 value 的字段名**/
        valueField: { type: String, default: 'value' },
        /**选项children的字段名**/
        childrenField: { type: String, default: 'children' }
    },
    setup(props, { emit }) {
        const { value } = useVModels(props, emit)

        async function fetchUpdate(vague: string, e: Omix, p: any) {
            return await nextTick(() => (value.value = vague)).then(() => {
                return emit('-change:value', value.value, e, p)
            })
        }

        return () => (
            <n-select
                class={{ 'form-base-select': true, 'is-multiple': props.multiple }}
                multiple={props.multiple}
                max-tag-count={props.maxTagCount}
                label-field={props.labelField}
                value-field={props.valueField}
                children-field={props.childrenField}
                v-model:value={value.value}
                on-update:value={fetchUpdate}
            ></n-select>
        )
    }
})
</script>

<style lang="scss" scoped>
.form-base-select {
    :deep(.n-tag) {
        --n-height: 26px;
    }
}
</style>
