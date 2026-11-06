<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Home',
    async httpServer({ pinia, logger }) {},
    setup() {
        return () => (
            <n-element class="flex flex-col flex-1 bg-transparent!">
                <layout-home-choose></layout-home-choose>
                <layout-home-issues></layout-home-issues>
                <layout-home-signal></layout-home-signal>
                <layout-home-facts></layout-home-facts>
            </n-element>
        )
    }
})
</script>
