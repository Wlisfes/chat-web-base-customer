<script lang="tsx">
import { defineComponent, h } from 'vue'
import { useState, useAosObserver } from '@/hooks'
import { useMouse, useStore } from '@/store'
import { RouterView } from 'vue-router'

export default defineComponent({
    name: 'BaseLayout',
    setup() {
        const { state, setState } = useState({ scrolled: false })
        const { fetchScrollbar } = useAosObserver()
        const { inverted } = useStore(useMouse)

        async function onContentScroll(event: Event) {
            return await setState({ scrolled: (event.target as HTMLElement).scrollTop > 8 }).then(() => {
                return fetchScrollbar(event)
            })
        }

        return () => (
            <n-layout class="h-full overflow-hidden bg-transparent!" content-class="flex flex-col overflow-hidden">
                <layout-client-canvas></layout-client-canvas>
                <n-layout-header
                    position="absolute"
                    class={['layout-site-header w-full', { 'is-scrolled': state.scrolled, 'is-dark': inverted.value }]}
                >
                    <n-element class="h-60 flex p-inline-20 gap-20 overflow-hidden bg-transparent!">
                        <router-link to="/" class="flex overflow-hidden decoration-none">
                            <n-button text focusable={false}>
                                <common-element-wrapper
                                    name="nest-logo"
                                    color="var(--n-text-color-hover)"
                                    size={40}
                                ></common-element-wrapper>
                                <h2 class="m-0 p-bs-8 p-inline-5">ChatBook</h2>
                            </n-button>
                        </router-link>
                        <n-element class="h-full flex flex-1 items-center justify-end gap-48 p-inline-40">
                            <n-button text focusable={false}>
                                <div class="text-16">产品</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">解决方案</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">覆盖范围&定价</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">支持中心</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">关于我们</div>
                            </n-button>
                        </n-element>
                        <n-element class="h-full flex items-center overflow-hidden">
                            <layout-common-deploy></layout-common-deploy>
                            <n-divider vertical class="h-20! m-inline-20!" />
                            <n-element class="flex items-center gap-20 overflow-hidden">
                                <n-button text focusable={false}>
                                    登录
                                </n-button>
                                <layout-common-consumer></layout-common-consumer>
                                <n-button focusable={false} round type="primary">
                                    免费体验
                                </n-button>
                            </n-element>
                        </n-element>
                    </n-element>
                </n-layout-header>
                <n-layout-content
                    class="layout-client-content flex-1 overflow-hidden bg-transparent!"
                    content-class="min-h-full flex flex-col bg-transparent! p-bs-60"
                    native-scrollbar={false}
                    scrollbar-props={{ size: 8, trigger: 'none' }}
                    on-scroll={onContentScroll}
                >
                    <RouterView>
                        {{
                            default: ({ Component, route }: Omix) => {
                                return Component && h(Component, { key: route.fullPath })
                            }
                        }}
                    </RouterView>
                    <layout-client-footer></layout-client-footer>
                </n-layout-content>
            </n-layout>
        )
    }
})
</script>

<style lang="scss" scoped>
.layout-client-content > :deep(.n-scrollbar > .n-scrollbar-rail--vertical) {
    z-index: 99;
}

.layout-site-header.n-layout-header {
    z-index: 99;
    background-color: transparent !important;
    transition:
        background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-site-header.n-layout-header.is-scrolled {
    background-color: rgba(247, 248, 252, 0.26) !important;
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    backdrop-filter: blur(18px) saturate(1.4);
    border-bottom: none !important;
    box-shadow: none !important;
}

.layout-site-header.n-layout-header.is-dark.is-scrolled {
    background-color: rgba(8, 12, 24, 0.18) !important;
    border-bottom: none !important;
    box-shadow: none !important;
}
</style>
