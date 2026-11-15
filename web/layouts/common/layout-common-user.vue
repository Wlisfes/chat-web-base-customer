<script lang="tsx">
import { defineComponent, Fragment } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobal, useStore } from '@/store'
import { useState, useProvider } from '@/hooks'
import { fetchDialogService } from '@/plugins'
import * as utils from '@/utils'

export default defineComponent({
    name: 'LayoutCommonUser',
    setup(props, ctx) {
        const router = useRouter()
        const { faseUser, loggedIn, fetchLogout } = useStore(useGlobal)
        const { theme, fetchThemeUpdate } = useProvider()
        const { state, setState } = useState({ visible: false, delay: false })

        /**异步关闭用户信息popover组件**/
        async function fetchClickoutside() {
            return await setState({ visible: false, delay: true }).then(async () => {
                await utils.fetchDelay(0)
                return await setState({ delay: false })
            })
        }

        /**异步开启用户信息popover组件**/
        async function fetchOpenCollapse(evt: MouseEvent) {
            await utils.stop(evt)
            return await utils.fetchHandler(!state.visible && !state.delay, async () => {
                return await setState({ visible: true })
            })
        }

        /**退出登录**/
        async function fetchCompose() {
            return await setState({ visible: false }).then(async () => {
                return await fetchDialogService({
                    title: '提示',
                    type: 'warning',
                    content: `确定要退出当前账号吗？`,
                    async onSubmit(done: Function) {
                        return await fetchLogout().then(async () => {
                            await done({ visible: false })
                            return router.push({ path: '/main/login', replace: true })
                        })
                    }
                })
            })
        }

        return () => {
            if (!loggedIn.value) {
                return (
                    <n-button text focusable={false} onClick={() => router.push('/main/login')}>
                        <common-base-icon size={24} name="nest-user"></common-base-icon>
                    </n-button>
                )
            }
            return (
                <div class="layout-common-user">
                    <n-popover
                        placement="bottom-end"
                        trigger="click"
                        width={300}
                        show={state.visible}
                        style={{ padding: 0, '--v-offset-left': '4px' }}
                        onClickoutside={fetchClickoutside}
                        v-slots={{
                            trigger: () => (
                                <div class="flex items-center gap-8 cursor-pointer select-none" onClick={fetchOpenCollapse}>
                                    {utils.isEmpty(faseUser.value.avatar) ? (
                                        <n-avatar round size={36} color="var(--primary-color)">
                                            {String(faseUser.value.name).slice(0, 1)}
                                        </n-avatar>
                                    ) : (
                                        <n-avatar round size={36} src={faseUser.value.avatar}></n-avatar>
                                    )}
                                    {/* <n-text class="max-w-120 text-14" depth={1}>
                                        <n-ellipsis tooltip={false}>{faseUser.value.name}</n-ellipsis>
                                    </n-text> */}
                                </div>
                            )
                        }}
                    >
                        <n-element class="flex flex-col overflow-hidden">
                            <div
                                class="flex items-center gap-10 p-16 select-none cursor-pointer border-b border-b-solid border-b-[var(--divider-color)]"
                                style={{ transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            >
                                {utils.isEmpty(faseUser.value.avatar) ? (
                                    <n-avatar round size={44} color="var(--primary-color)" class="text-18">
                                        {String(faseUser.value.name).slice(0, 1)}
                                    </n-avatar>
                                ) : (
                                    <n-avatar round size={44} src={faseUser.value.avatar}></n-avatar>
                                )}
                                <div class="flex flex-col flex-1">
                                    <n-text depth={1} style={{ fontSize: '16px', lineHeight: '24px' }}>
                                        <n-ellipsis tooltip={false}>{faseUser.value.name}</n-ellipsis>
                                    </n-text>
                                    <n-text depth={3} style={{ lineHeight: '20px' }}>
                                        <n-ellipsis tooltip={false}>
                                            {faseUser.value.email || `UID：${faseUser.value.uid ?? '-'}`}
                                        </n-ellipsis>
                                    </n-text>
                                </div>
                            </div>
                            <n-list hoverable clickable show-divider={false} class="p-inline-10 p-block-10 select-none">
                                <n-list-item style={{ padding: 0 }}>
                                    <div class="h-24 flex items-center gap-10 p-inline-10 p-block-10">
                                        <common-base-icon size={22} name="nest-issues-cost"></common-base-icon>
                                        <n-text>进入控制台</n-text>
                                    </div>
                                </n-list-item>
                                <n-list-item style={{ padding: 0 }}>
                                    <div class="h-24 flex items-center gap-10 p-inline-10 p-block-10">
                                        <common-base-icon size={22} name="nest-settings"></common-base-icon>
                                        <n-text>账户设置</n-text>
                                    </div>
                                </n-list-item>
                                <n-list-item
                                    style={{ padding: 0 }}
                                    onClick={() => fetchThemeUpdate(theme.value === 'dark' ? 'light' : 'dark')}
                                >
                                    <div class="h-24 flex items-center gap-10 p-inline-10 p-block-10">
                                        {theme.value === 'dark' ? (
                                            <Fragment>
                                                <common-base-icon size={24} name="nest-light"></common-base-icon>
                                                <n-text>浅色模式</n-text>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <common-base-icon size={24} name="nest-dark"></common-base-icon>
                                                <n-text>深色模式</n-text>
                                            </Fragment>
                                        )}
                                    </div>
                                </n-list-item>
                            </n-list>
                            <div class="p-inline-10 p-block-10 flex flex-col p-bs-0">
                                <common-base-button size="large" icon="nest-quit" secondary onClick={fetchCompose}>
                                    退出登录
                                </common-base-button>
                            </div>
                        </n-element>
                    </n-popover>
                </div>
            )
        }
    }
})
</script>
