<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Home',
    async httpServer({ pinia, logger }) {},
    setup() {
        return () => <n-element class="flex flex-col flex-1">Home</n-element>
    }
})
</script>
