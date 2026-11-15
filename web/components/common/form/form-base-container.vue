<script lang="tsx">
import { defineComponent, provide, ref, Ref, onMounted, nextTick, PropType } from 'vue'
import { FormInst } from 'naive-ui'
import { stop } from '@/utils'

export default defineComponent({
    name: 'FormBaseContainer',
    props: {
        /**表单对象**/
        formState: { type: Object as PropType<Omix>, default: () => ({}) },
        /**是否开启栅格模板**/
        baseColumnsTemplate: { type: Boolean as PropType<boolean>, default: false },
        /**栅格模板配置**/
        baseColumnsTemplateProps: { type: Object as PropType<Omix>, default: () => ({}) }
    },
    setup(props, { slots, expose }) {
        const formOptions = ref({}) as Ref<Omix<FormInst>>
        const formRef = ref() as Ref<Omix<FormInst>>
        const fields = ref<Array<Omix>>([])
        onMounted(() => {
            formOptions.value.theme = formRef.value.theme
            formOptions.value.themeOverrides = formRef.value.themeOverrides
            formOptions.value.builtinThemeOverrides = formRef.value.builtinThemeOverrides
            formOptions.value.inline = formRef.value.inline
            formOptions.value.labelWidth = formRef.value.labelWidth
            formOptions.value.labelAlign = formRef.value.labelAlign
            formOptions.value.labelPlacement = formRef.value.labelPlacement
            formOptions.value.model = formRef.value.model
            formOptions.value.rules = formRef.value.rules
            formOptions.value.disabled = formRef.value.disabled
            formOptions.value.size = formRef.value.size
            formOptions.value.showRequireMark = formRef.value.showRequireMark
            formOptions.value.requireMarkPlacement = formRef.value.requireMarkPlacement
            formOptions.value.showFeedback = formRef.value.showFeedback
            formOptions.value.onSubmit = formRef.value.onSubmit
            formOptions.value.showLabel = formRef.value.showLabel
            formOptions.value.validateMessages = formRef.value.validateMessages
            formOptions.value.mergedClsPrefix = formRef.value.mergedClsPrefix
            formOptions.value.restoreValidation = formRef.value.restoreValidation
            formOptions.value.validate = formRef.value.validate
            formOptions.value.restore = restore
            formOptions.value.insert = insert
            formOptions.value.remove = remove
        })

        /**新增实例**/
        async function insert(field: Omix) {
            return fields.value.push(field)
        }

        /**移除实例**/
        async function remove(field: Omix) {
            return fields.value.splice(fields.value.indexOf(field), 1)
        }

        /**重置**/
        async function restore() {
            return await nextTick(() => fields.value.forEach(field => field.restore())).then(() => {
                return props.formState
            })
        }

        /**注入实例**/
        provide('FORM_BASE_INSTANCE', formOptions)
        /**导出配置**/
        expose(formOptions.value)

        return () => (
            <n-form ref={formRef} class="form-base-container" onSubmit={stop}>
                {props.baseColumnsTemplate ? (
                    <common-base-columns-template {...props.baseColumnsTemplateProps}>
                        {slots.default && slots.default()}
                    </common-base-columns-template>
                ) : (
                    slots.default && slots.default()
                )}
            </n-form>
        )
    }
})
</script>
