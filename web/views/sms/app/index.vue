<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'WebSmsApp',
    async httpServer({ pinia, logger }) {},
    setup() {
        return () => (
            <common-base-element>
                <layout-client-facts hot class="p-be-68">
                    <layout-client-signal></layout-client-signal>
                </layout-client-facts>
                <layout-client-choose></layout-client-choose>
                <layout-client-issues></layout-client-issues>
                <layout-client-facts></layout-client-facts>
            </common-base-element>
        )
    }
})
</script>
