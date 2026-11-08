<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Home',
    async httpServer({ pinia, logger }) {},
    setup() {
        return () => (
            <n-element class="flex flex-col flex-1 bg-transparent!">
                <layout-client-choose></layout-client-choose>
                <layout-client-issues></layout-client-issues>
                <layout-client-signal></layout-client-signal>
                <layout-client-facts></layout-client-facts>
            </n-element>
        )
    }
})
</script>
