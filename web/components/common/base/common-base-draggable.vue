<script lang="tsx">
import { defineComponent } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

export default defineComponent({
    name: 'CommonBaseDraggable',
    components: { VueDraggable },
    setup(props, { slots }) {
        return () => <vue-draggable class="common-base-draggable">{slots.default && slots.default()}</vue-draggable>
    }
})
</script>
