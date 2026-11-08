<script lang="tsx">
import { defineComponent } from 'vue'
import { useI18nContext } from '@/i18n'

const chooseMeta = [
    { type: 'primary', icon: 'nest-issues-signal' },
    { type: 'warning', icon: 'nest-edit' },
    { type: 'error', icon: 'nest-choose-channel' },
    { type: 'success', icon: 'nest-choose-backst' }
]

export default defineComponent({
    name: 'LayoutClientChoose',
    setup() {
        const { t, tm } = useI18nContext()

        return () => (
            <n-element class="layout-client-choose common-width-inline flex flex-col p-block-64 box-border">
                <div class="flex flex-col items-center max-w-640 m-inline-auto">
                    <n-text class="chat-hot text-[var(--primary-color)]">{t('home.choose.hot')}</n-text>
                    <h1 class="m-0 text-28">{t('home.choose.title')}</h1>
                    <n-text depth={3} class="text-16 text-center!">
                        {t('home.choose.document')}
                    </n-text>
                </div>
                <div class="chat-choose grid gap-24 p-bs-48">
                    {tm('home.choose.columns').map((item, index) => (
                        <div key={index} class="chat-choose-column" data-aos="fade-up" data-aos-delay={index * 100}>
                            <n-card hoverable content-class="p-24!" class="b-rd-8 h-full">
                                <n-button secondary circle focusable={false} type={chooseMeta[index].type} class="w-64 h-64">
                                    <common-element-wrapper name={chooseMeta[index].icon} size={32}></common-element-wrapper>
                                </n-button>
                                <div class="flex flex-col gap-5 m-bs-10">
                                    <h1 class="m-0 text-18">{item.title}</h1>
                                    <n-text depth={3}>{item.document}</n-text>
                                </div>
                            </n-card>
                        </div>
                    ))}
                </div>
            </n-element>
        )
    }
})
</script>

<style lang="scss" scoped>
.chat-choose {
    position: relative;
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    @media (max-width: 768px) {
        grid-template-columns: repeat(1, minmax(0px, 1fr));
    }
}
</style>
