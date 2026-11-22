<script lang="tsx">
import { computed, defineComponent, h } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { RouterView, useRoute } from 'vue-router'

export default defineComponent({
    name: 'WebLayout',
    setup() {
        const { isFullscreen, toggle } = useFullscreen()
        const route = useRoute()
        const showSider = computed(() => route.meta.sider ?? true)

        return () => (
            <n-layout class="h-full" content-class="flex flex-col overflow-hidden">
                <n-layout-header bordered class="layout-web-header">
                    <common-base-element class="h-60 flex p-inline-20 gap-x-24 overflow-hidden">
                        <layout-common-logo></layout-common-logo>
                        <n-element class="h-full flex flex-1 items-center gap-x-32 p-inline-24 overflow-hidden">
                            <router-link class="web-link" to="/web/home">
                                概览
                            </router-link>
                            <router-link class="web-link" to="/web/sms">
                                短信
                            </router-link>
                            <router-link class="web-link" to="/web/voice">
                                语音
                            </router-link>
                            <router-link class="web-link" to="/web/mail">
                                邮件
                            </router-link>
                            <router-link class="web-link" to="/web/whatsapp">
                                WhatsApp
                            </router-link>
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
                    </common-base-element>
                </n-layout-header>
                <n-layout has-sider={showSider.value} content-class="flex flex-col overflow-hidden">
                    {showSider.value && (
                        <n-layout-sider
                            embedded
                            width={240}
                            collapsed-width={64}
                            class="layout-web-sider"
                            show-trigger="bar"
                            collapse-mode="width"
                            native-scrollbar={false}
                            style={{ zIndex: 2 }}
                        >
                            {route.path.startsWith('/web/sms') && <layout-common-sms-sider></layout-common-sms-sider>}
                        </n-layout-sider>
                    )}
                    <n-layout-content
                        class="flex-1 overflow-hidden"
                        content-class="min-h-full flex flex-col overflow-hidden"
                        scrollbar-props={{ size: 100, trigger: 'none' }}
                        native-scrollbar={false}
                    >
                        <common-base-element class="flex flex-col flex-1 relative overflow-hidden bg-[var(--common-body-bg-color)]">
                            <RouterView>
                                {{
                                    default: ({ Component, route }: Omix) => {
                                        return Component && h(Component, { key: route.fullPath })
                                    }
                                }}
                            </RouterView>
                        </common-base-element>
                    </n-layout-content>
                </n-layout>
            </n-layout>
        )
    }
})
</script>

<style lang="scss" scoped>
.web-link {
    position: relative;
    padding: 3px 2px;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-color-2);
    text-decoration: none;
    transition: color 0.3s var(--cubic-bezier-ease-in-out);
    &::before {
        content: '';
        height: 3px;
        position: absolute;
        border-radius: 2px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        transition: background-color 0.3s var(--cubic-bezier-ease-in-out);
    }
    &:hover {
        color: var(--primary-color-hover);
    }
    &.router-link-active {
        color: var(--primary-color-hover);
        &::before {
            background-color: var(--primary-color-hover);
        }
    }
}
</style>
