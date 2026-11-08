<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CommonBaseImage',
    props: {
        src: { type: String }
    },
    setup(props, ctx) {
        return () => <n-image class="common-base-image" src={props.src}></n-image>
    }
})
</script>

<style lang="scss" scoped>
.common-base-image.n-image {
    position: relative;
    :deep(img) {
        display: block;
    }
}
</style>
