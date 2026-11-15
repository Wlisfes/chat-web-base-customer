<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LayoutCommonLogo',
    props: {
        /**跳转路径**/
        path: { type: String, default: '/' }
    },
    setup(props) {
        return () => (
            <router-link to={props.path} class="layout-common-logo flex overflow-hidden decoration-none">
                <n-button text focusable={false}>
                    <common-element-wrapper name="nest-logo" color="var(--n-text-color-hover)" size={40}></common-element-wrapper>
                    <h2 class="m-0 p-bs-8 p-inline-5">ChatBook</h2>
                </n-button>
            </router-link>
        )
    }
})
</script>
