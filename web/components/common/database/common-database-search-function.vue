<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CommonDatabaseSearchFunction',
    props: {
        /**是否不需要根节点包裹：只在common-database-search组件中生效**/
        abstract: { type: Boolean, default: false }
    },
    setup(props, { slots }) {
        return () => (
            <n-element class="common-database-search-function flex-1 overflow-hidden whitespace-nowrap">
                {slots.default && slots.default()}
            </n-element>
        )
    }
})
</script>
