<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'BaseHome',
    async httpServer({ pinia, logger }) {
        logger.info({
            title: '大苏打33的撒大1111111dsadasdsaDDSADAASDSADASDASDASDAdas',
            date: Date.now()
        })
    },
    setup() {
        return () => (
            <n-element class="flex flex-col flex-1 bg-transparent!">
                <layout-home-choose></layout-home-choose>
                <layout-home-issues></layout-home-issues>1<layout-home-signal></layout-home-signal>
                <layout-home-facts></layout-home-facts>
            </n-element>
        )
    }
})
</script>
