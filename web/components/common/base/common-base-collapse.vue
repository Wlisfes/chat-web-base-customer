<script lang="tsx">
import { defineComponent } from 'vue'
import { useVModels } from '@vueuse/core'
import { Collapse } from 'vue-collapsed'

export default defineComponent({
    name: 'CommonBasePopover',
    emits: ['update:when'],
    props: {
        /**是否展示**/
        when: { type: Boolean, default: false }
    },
    setup(props, { slots, emit }) {
        const { when } = useVModels(props, emit)

        return () => <Collapse when={when.value}>{slots.default && slots.default()}</Collapse>
    }
})
</script>
