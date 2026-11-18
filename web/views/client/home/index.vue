<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CalintHome',
    async httpServer({ pinia, logger }) {},
    setup() {
        return () => (
            <n-element class="flex flex-col flex-1 bg-transparent!">
                <layout-client-facts hot class="p-be-68">
                    <layout-client-signal></layout-client-signal>
                </layout-client-facts>
                <layout-client-choose></layout-client-choose>
                <layout-client-issues></layout-client-issues>
                <layout-client-facts></layout-client-facts>
            </n-element>
        )
    }
})
</script>
