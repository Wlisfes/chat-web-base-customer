<script lang="tsx">
import { defineComponent, h } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { RouterView } from 'vue-router'

export default defineComponent({
    name: 'WebLayout',
    setup() {
        const { isFullscreen, toggle } = useFullscreen()

        return () => (
            <n-layout class="h-full" content-class="flex flex-col overflow-hidden">
                <n-layout-header class="layout-web-header">
                    <n-element class="h-60 flex p-inline-20 gap-x-24 overflow-hidden">
                        <layout-common-logo></layout-common-logo>
                        <n-element class="h-full flex flex-1"></n-element>
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
                <n-layout has-sider content-class="flex flex-col overflow-hidden">
                    <n-layout-sider
                        class="layout-web-sider"
                        width={240}
                        collapse-mode="width"
                        native-scrollbar={false}
                        style={{ zIndex: 2 }}
                        //collapsed={collapsed.value}
                        //collapsed-width={device.value === 'MOBILE' ? 0 : 64}
                        //show-trigger={device.value === 'MOBILE' ? false : 'bar'}
                        //on-update:collapsed={(value: boolean) => setState({ collapsed: value })}
                    ></n-layout-sider>
                    <n-layout-content
                        class="flex-1 overflow-hidden"
                        content-class="min-h-full flex flex-col overflow-hidden"
                        native-scrollbar={false}
                        scrollbar-props={{ size: 100, trigger: 'none' }}
                    >
                        <RouterView>
                            {{
                                default: ({ Component, route }: Omix) => {
                                    return Component && h(Component, { key: route.fullPath })
                                }
                            }}
                        </RouterView>
                    </n-layout-content>
                </n-layout>
            </n-layout>
        )
    }
})
</script>
