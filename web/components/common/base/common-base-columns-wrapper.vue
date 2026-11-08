<script lang="tsx">
import { defineComponent, PropType, VNode } from 'vue'
import { isNotEmpty } from '@/utils'

export default defineComponent({
    name: 'CommonBaseColumnsWrapper',
    props: {
        /**描述**/
        label: { type: [String, Number, Object] as PropType<string | number | VNode> },
        /**开启纵向排列**/
        vertical: { type: Boolean, default: false },
        /**标签类名**/
        labelClass: { type: String, default: '' },
        /**内容类名**/
        contentClass: { type: String, default: '' }
    },
    setup(props, { slots }) {
        return () => (
            <div class={{ 'common-base-columns-wrapper flex overflow-hidden line-height-24': true, 'flex-col': props.vertical }}>
                {isNotEmpty(props.label) && (
                    <div class={`common-base-columns-wrapper__label box-border ${props.labelClass}`}>{props.label}</div>
                )}
                <div class={`common-base-columns-wrapper__content flex-1 overflow-hidden ${props.contentClass}`}>
                    {slots.default && slots.default()}
                </div>
            </div>
        )
    }
})
</script>

<style lang="scss" scoped>
.common-base-columns-wrapper {
    position: relative;
    font-size: 14px;
    &__label {
        color: var(--text-color-3);
        transition: color 0.3s var(--n-bezier);
    }
    &__content {
        color: var(--text-color-1);
        transition: color 0.3s var(--n-bezier);
    }
}
</style>
