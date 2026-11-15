<script lang="tsx">
import { defineComponent, Fragment } from 'vue'
import { useDialog, useNotification } from 'naive-ui'

export default defineComponent({
    name: 'LayoutCommonMount',
    setup(props, { slots }) {
        const dialog = useDialog()
        const notification = useNotification()
        if (typeof window !== 'undefined') {
            window.$dialog = dialog
            window.$notification = notification
        }

        return () => <Fragment>{slots.default && slots.default()}</Fragment>
    }
})
</script>