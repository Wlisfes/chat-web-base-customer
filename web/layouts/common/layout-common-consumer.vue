<script lang="tsx">
import { computed, defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobal, useStore } from '@/store'

export default defineComponent({
    name: 'LayoutCommonConsumer',
    setup() {
        const router = useRouter()
        const { user, loggedIn, fetchInitialize, fetchLogout } = useStore(useGlobal)
        const label = computed(() => user.value.alias || user.value.name || user.value.email || '账户')
        const initial = computed(() => String(label.value).slice(0, 1))

        onMounted(() => {
            fetchInitialize()
        })

        return () =>
            loggedIn.value ? (
                <n-popover trigger="click" placement="bottom-end" style={{ padding: '0' }}>
                    {{
                        trigger: () => (
                            <div class="flex items-center gap-8 select-none cursor-pointer">
                                <n-avatar round size={32} color="var(--primary-color)">
                                    {initial.value}
                                </n-avatar>
                                <span class="max-w-120 text-14 truncate">{label.value}</span>
                            </div>
                        ),
                        default: () => (
                            <div class="w-260 flex flex-col">
                                <div class="flex items-center gap-10 p-16 border-b border-b-solid border-b-[var(--divider-color)]">
                                    <n-avatar round size={40} color="var(--primary-color)">
                                        {initial.value}
                                    </n-avatar>
                                    <div class="flex flex-col flex-1 overflow-hidden">
                                        <n-ellipsis>{label.value}</n-ellipsis>
                                        <n-text depth={3}>{user.value.email || user.value.uid}</n-text>
                                    </div>
                                </div>
                                <div class="p-12">
                                    <n-button block secondary onClick={fetchLogout}>
                                        退出登录
                                    </n-button>
                                </div>
                            </div>
                        )
                    }}
                </n-popover>
            ) : (
                <n-button text focusable={false} onClick={() => router.push('/main/login')}>
                    <common-element-wrapper name="nest-user" size={24}></common-element-wrapper>
                </n-button>
            )
    }
})
</script>

<style lang="scss" scoped>
.layout-common-consumer {
    position: relative;
}
</style>
