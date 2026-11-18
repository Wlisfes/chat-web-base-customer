<script lang="tsx">
import { computed, defineComponent, h } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { RouterView, useRoute } from 'vue-router'

export default defineComponent({
    name: 'WebLayout',
    setup() {
        const { isFullscreen, toggle } = useFullscreen()
        const route = useRoute()

        return () => (
            <n-layout class="h-full" content-class="flex flex-col overflow-hidden">
                <n-layout-header class="layout-web-header">
                    <n-element class="h-60 flex p-inline-20 gap-x-24 overflow-hidden">
                        <layout-common-logo></layout-common-logo>
                        <n-element class="h-full flex flex-1 items-center gap-x-32 p-inline-24 overflow-hidden">
                            <n-button text focusable={false}>
                                <div class="text-16">概览</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">短信</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">语音</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">邮件</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">WhatsApp</div>
                            </n-button>
                        </n-element>
                        <n-element class="h-full flex items-center gap-x-20 overflow-hidden">
                            <layout-common-deploy></layout-common-deploy>
                            <common-base-button
                                text
                                icon-size={22}
                                onClick={toggle}
                                icon={isFullscreen.value ? 'nest-shrink' : 'nest-screen'}
                            ></common-base-button>
                            <common-base-button text icon-size={22} icon="nest-notify"></common-base-button>
                            <layout-common-user></layout-common-user>
                        </n-element>
                    </n-element>
                </n-layout-header>
                <n-layout has-sider={route.meta.sider ?? true} content-class="flex flex-col overflow-hidden">
                    {(route.meta.sider ?? true) && (
                        <n-layout-sider
                            class="layout-web-sider"
                            width={240}
                            collapse-mode="width"
                            native-scrollbar={false}
                            style={{ zIndex: 2 }}
                        ></n-layout-sider>
                    )}
                    <n-layout-content
                        class="flex-1 overflow-hidden"
                        content-class="min-h-full flex flex-col overflow-hidden"
                        native-scrollbar={false}
                        scrollbar-props={{ size: 100, trigger: 'none' }}
                    >
                        <n-element class="flex flex-col flex-1 relative transition-background-color transition-duration-300 bg-[var(--common-body-bg-color)]">
                            <RouterView>
                                {{
                                    default: ({ Component, route }: Omix) => {
                                        return Component && h(Component, { key: route.fullPath })
                                    }
                                }}
                            </RouterView>
                        </n-element>
                    </n-layout-content>
                </n-layout>
            </n-layout>
        )
    }
})
</script>
