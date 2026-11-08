<script lang="tsx">
import { defineComponent } from 'vue'
import { useI18nContext } from '@/i18n'

const issueMeta = [
    { type: 'primary', icon: 'nest-issues-chat' },
    { type: 'success', icon: 'nest-issues-signal' },
    { type: 'warning', icon: 'nest-issues-book' },
    { type: 'error', icon: 'nest-issues-cost' },
    { type: 'primary', icon: 'nest-issues-security' },
    { type: 'success', icon: 'nest-issues-support' }
]

export default defineComponent({
    name: 'LayoutClientIssues',
    setup() {
        const { t, tm } = useI18nContext()

        return () => (
            <n-element class="layout-client-issues common-width-inline flex flex-col p-bs-24 p-be-48 box-border">
                <n-text class="chat-hot">{t('home.issues.hot')}</n-text>
                <div class="chat-issues flex justify-between p-be-24">
                    <div class="w-full max-w-[var(--chat-issues-max-width)] flex flex-col gap-5 p-ie-16">
                        <h1 class="m-0 text-28">{t('home.issues.title')}</h1>
                        <n-text depth={3} class="text-16">
                            {t('home.issues.document')}
                        </n-text>
                    </div>
                    <div class="flex items-end justify-center gap-16" data-aos="fade-left">
                        <n-button size="large" type="primary">
                            {t('home.issues.support')}
                        </n-button>
                        <n-button size="large" type="primary" ghost>
                            {t('home.issues.contact')}
                        </n-button>
                    </div>
                </div>
                <div class="chat-block grid gap-24 p-bs-24">
                    {tm('home.issues.columns').map((item, index) => (
                        <div key={index} class="chat-block-column" data-aos="fade-up" data-aos-delay={index * 100}>
                            <n-card hoverable content-class="p-24!" class="b-rd-8 h-full">
                                <n-button secondary circle focusable={false} type={issueMeta[index].type} class="w-64 h-64">
                                    <common-element-wrapper name={issueMeta[index].icon} size={32}></common-element-wrapper>
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
.chat-hot {
    color: var(--primary-color);
    @media (max-width: 768px) {
        text-align: center;
    }
}

.chat-issues {
    --chat-issues-max-width: 540px;
    position: relative;
    @media (max-width: 768px) {
        --chat-issues-max-width: 100%;
        flex-direction: column;
        text-align: center;
        row-gap: 20px;
    }
}

.chat-block {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
    position: relative;
    @media (max-width: 1280px) {
        grid-template-columns: repeat(2, minmax(0px, 1fr));
    }
    @media (max-width: 768px) {
        grid-template-columns: repeat(1, minmax(0px, 1fr));
    }
}
</style>
