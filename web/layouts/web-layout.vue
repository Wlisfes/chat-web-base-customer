<script lang="tsx">
import { defineComponent, h } from 'vue'
import { useI18nContext } from '@/i18n'
import { RouterView } from 'vue-router'

export default defineComponent({
    name: 'WebLayout',
    setup() {
        const { t } = useI18nContext()

        return () => (
            <n-layout class="h-full overflow-hidden bg-transparent!" content-class="flex flex-col overflow-hidden">
                <n-layout-header class="layout-site-header w-full" position="absolute">
                    <n-element class="h-60 flex p-inline-20 gap-x-24 overflow-hidden bg-transparent!">
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
                        <n-element class="h-full flex flex-1 items-center justify-end gap-x-24 overflow-hidden">
                            <n-button text focusable={false}>
                                <div class="text-16">{t('home.site.nav.product')}</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">{t('home.site.nav.solutions')}</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">{t('home.site.nav.coverage')}</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">{t('home.site.nav.support')}</div>
                            </n-button>
                            <n-button text focusable={false}>
                                <div class="text-16">{t('home.site.nav.about')}</div>
                            </n-button>
                        </n-element>
                        <n-element class="h-full flex items-center gap-x-20 overflow-hidden">
                            <layout-common-deploy></layout-common-deploy>
                            <layout-common-user></layout-common-user>
                        </n-element>
                    </n-element>
                </n-layout-header>
                <n-layout-content
                    class="layout-client-content flex-1 overflow-hidden bg-transparent!"
                    content-class="min-h-full flex flex-col bg-transparent! p-bs-60"
                    native-scrollbar={false}
                    scrollbar-props={{ size: 8, trigger: 'none' }}
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
        )
    }
})
</script>
