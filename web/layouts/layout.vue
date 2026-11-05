<script lang="tsx">
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import { useState } from '@/hooks'
import { useMouse, useStore } from '@/store'

export default defineComponent({
    name: 'BaseLayout',
    setup() {
        const { inverted } = useStore(useMouse)
        const { state, setState } = useState({
            scrolled: false,
            navs: ['产品', '解决方案', '覆盖范围&定价', '支持中心', '关于我们']
        })

        function onScroll(event: Event) {
            const target = event.target as HTMLElement
            const scroller = target?.closest?.('.n-scrollbar-container') || target
            const top = scroller?.scrollTop || target?.scrollTop || 0
            return setState({ scrolled: top > 0 })
        }

        return () => (
            <n-layout
                class={{ 'site-shell h-full overflow-hidden': true, 'is-dark': inverted.value }}
                content-class="flex flex-col overflow-hidden"
            >
                <neon-background></neon-background>
                <n-layout-header class={{ 'site-header': true, 'is-scrolled': state.scrolled }} bordered={false}>
                    <div class="site-nav">
                        <span class="site-nav-glow"></span>
                        <router-link to="/" class="site-brand">
                            <common-element-wrapper name="nest-logo" size={28}></common-element-wrapper>
                            <strong>ChatBook</strong>
                            <em>SMS</em>
                        </router-link>
                        <nav class="site-links">
                            {state.navs.map(item => (
                                <a key={item} href="javascript:void(0)">
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div class="site-actions">
                            <layout-common-deploy></layout-common-deploy>
                            <router-link to="/main/login" class="site-login">
                                登录
                            </router-link>
                            <router-link to="/main/register" class="site-cta">
                                免费体验
                            </router-link>
                        </div>
                    </div>
                </n-layout-header>
                <n-layout-content
                    class="flex-1 overflow-hidden"
                    content-class="min-h-full flex flex-col"
                    native-scrollbar={false}
                    scrollbar-props={{ size: 8, trigger: 'none' }}
                    on-scroll={onScroll}
                >
                    <n-element class="site-page flex flex-col flex-1">
                        <RouterView>
                            {{
                                default: ({ Component, route }: Omix) => {
                                    return Component && h(Component, { key: route.fullPath })
                                }
                            }}
                        </RouterView>
                    </n-element>
                    <layout-common-footer></layout-common-footer>
                </n-layout-content>
            </n-layout>
        )
    }
})
</script>

<style lang="scss">
.site-shell.n-layout,
.site-shell .n-layout-scroll-container {
    height: 100%;
    overflow: hidden;
}

.site-shell .n-layout-content {
    position: relative;
    z-index: 1;
    min-height: 0;
}

.site-header.n-layout-header,
.site-header.n-layout-header--static-positioned {
    position: fixed !important;
    top: 0;
    right: 0;
    left: 0;
    z-index: 3000 !important;
    height: 56px !important;
    padding: 0 28px !important;
    background: transparent !important;
    background-color: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    transition:
        background 0.25s ease,
        backdrop-filter 0.25s ease,
        border-color 0.25s ease;
}

.site-header.is-scrolled {
    background: transparent !important;
    border-bottom: 0 !important;
    box-shadow: 0 10px 30px rgba(20, 28, 45, 0.08);
}

.site-header.n-layout-header {
    isolation: isolate;
}

.site-shell .n-layout-content,
.site-shell .n-scrollbar,
.site-shell .n-scrollbar-container {
    position: relative;
    z-index: 1;
}

.site-header.is-scrolled::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: rgba(246, 248, 255, 0.92);
    backdrop-filter: blur(22px) saturate(1.6);
    -webkit-backdrop-filter: blur(22px) saturate(1.6);
}

.site-shell.is-dark .site-header.is-scrolled {
    background: transparent !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.site-shell.is-dark .site-header.is-scrolled::before {
    background: rgba(7, 11, 22, 0.82);
}

.site-page {
    padding-top: 56px;
}

.site-header .site-nav {
    z-index: 1;
}

.site-nav {
    position: relative;
    display: flex;
    align-items: center;
    gap: 28px;
    height: 56px;
    color: #f4f7ff;
}

.site-nav-glow {
    display: none;
}

.site-brand,
.site-links,
.site-actions {
    position: relative;
    z-index: 1;
}

.site-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    color: inherit;
    text-decoration: none;
}

.site-brand strong {
    font-size: 20px;
    font-weight: 650;
    letter-spacing: -0.02em;
}

.site-brand em {
    padding: 2px 7px;
    border-radius: 999px;
    color: #d7e4ff;
    border: 1px solid rgba(255, 255, 255, 0.28);
    font-size: 11px;
    font-style: normal;
    letter-spacing: 0.12em;
}

.site-links {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: 26px;
}

.site-links a,
.site-login {
    color: rgba(244, 247, 255, 0.82);
    font-size: 14px;
    text-decoration: none;
}

.site-links a:hover,
.site-login:hover {
    color: #fff;
}

.site-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.site-actions .n-icon,
.site-brand .n-icon,
.site-actions .text-13 {
    color: #3c4658;
}

.site-cta {
    display: inline-flex;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    border-radius: 999px;
    color: #161616;
    text-decoration: none;
    background: #fff;
    border: 0;
}

.site-nav .n-divider {
    background-color: rgba(28, 36, 52, 0.12) !important;
}

.site-shell.is-dark .site-nav,
.site-shell.is-dark .site-links a,
.site-shell.is-dark .site-login,
.site-shell.is-dark .site-actions .n-icon,
.site-shell.is-dark .site-brand .n-icon,
.site-shell.is-dark .site-actions .text-13 {
    color: #f4f7ff;
}

.site-shell.is-dark .site-brand em {
    color: #d7e4ff;
    border-color: rgba(255, 255, 255, 0.28);
}

.site-shell.is-dark .site-cta {
    color: #111;
    background: #fff;
    border-color: transparent;
}

.site-shell.is-dark .site-nav .n-divider {
    background-color: rgba(255, 255, 255, 0.18) !important;
}
.site-shell .n-scrollbar-rail {
    opacity: 1 !important;
}

.site-shell .n-scrollbar-rail__scrollbar {
    background-color: rgba(60, 72, 96, 0.45) !important;
}

.site-shell.is-dark .n-scrollbar-rail__scrollbar {
    background-color: rgba(186, 204, 255, 0.55) !important;
}
.site-shell .n-scrollbar-rail--vertical {
    top: 56px !important;
    z-index: 2 !important;
}

.site-header .site-nav {
    position: relative;
    z-index: 1;
}
</style>
