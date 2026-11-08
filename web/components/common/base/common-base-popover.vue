<script lang="tsx">
import { defineComponent, ref, Ref, Fragment } from 'vue'
import { PopoverInst } from 'naive-ui'
import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'CommonBasePopover',
    props: {
        /**是否展示**/
        visible: { type: Boolean, default: false }
    },
    setup(props, { slots, emit }) {
        const { visible } = useVModels(props, emit)
        const instance = ref() as Ref<PopoverInst>

        return () => (
            <n-popover ref={instance} placement="bottom" trigger="click" arrow-point-to-center show={visible.value}>
                {{
                    trigger: () => <Fragment>{slots.trigger && slots.trigger(instance)}</Fragment>,
                    default: () => <Fragment>{slots.default && slots.default(instance)}</Fragment>
                }}
            </n-popover>
        )
    }
})
</script>
