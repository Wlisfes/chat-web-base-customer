<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'BaseHome',
    setup() {
        return () => (
            <n-element class="home-stage flex flex-col flex-1">
                <layout-home-choose></layout-home-choose>
                <layout-home-issues></layout-home-issues>
                <layout-home-signal></layout-home-signal>
                <layout-home-facts></layout-home-facts>
            </n-element>
        )
    }
})
</script>

<style lang="scss" scoped>
.home-stage {
    background: transparent;
}
</style>
