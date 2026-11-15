<script lang="tsx">
import { defineComponent, nextTick } from 'vue'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'FormBaseTreeSelect',
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
        /**选项value的字段名**/
        labelValue: { type: String, default: 'value' },
        /**选项children的字段名**/
        childrenField: { type: String, default: 'children' }
    },
    setup(props, { emit }) {
        const { value } = useVModels(props, emit)

        async function fetchUpdate(vague: string) {
            return await nextTick(() => (value.value = vague)).then(() => {
                return emit('-change:value', value.value)
            })
        }

        return () => (
            <n-tree-select
                class={{ 'form-base-tree-select': true, 'is-multiple': props.multiple }}
                multiple={props.multiple}
                max-tag-count={props.maxTagCount}
                label-field={props.labelField}
                key-field={props.labelValue}
                children-field={props.childrenField}
                v-model:value={value.value}
                on-update:value={fetchUpdate}
            ></n-tree-select>
        )
    }
})
</script>

<style lang="scss" scoped>
.form-base-tree-select {
    :deep(.n-tag) {
        --n-height: 26px;
    }
}
</style>
