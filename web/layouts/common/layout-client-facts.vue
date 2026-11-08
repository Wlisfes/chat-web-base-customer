<script lang="tsx">
import { defineComponent } from 'vue'
import { useMouse, useStore } from '@/store'
import { useI18nContext } from '@/i18n'

export default defineComponent({
    name: 'LayoutClientFacts',
    setup() {
        const { inverted } = useStore(useMouse)
        const { t, tm } = useI18nContext()

        return () => (
            <n-element class="layout-client-facts common-width-inline box-border">
                <div class="facts-box flex flex-col items-center">
                    <n-text class="chat-hot z-2 p-be-5">{t('home.facts.hot')}</n-text>
                    <h1 class="m-0 text-size-[var(--facts-box-title-size)] text-center max-w-870 z-2 p-be-24">{t('home.facts.title')}</h1>
                    <div class="chat-element w-full grid gap-24 p-bs-24 z-2">
                        {tm('home.facts.columns').map((item, index) => (
                            <div key={index} class="chat-element-column flex flex-col items-center" data-aos="zoom-in">
                                <n-h1 type="primary" class="m-0 text-size-[var(--chat-element-title-size)]">
                                    <n-text strong type="primary">
                                        {item.title}
                                    </n-text>
                                </n-h1>
                                <n-text class="16">{item.document}</n-text>
                            </div>
                        ))}
                    </div>
                </div>
                <div data-aos="fade-up">
                    <n-card embedded bordered={false} class={{ 'chat-super-card': true, 'is-light': !inverted.value }}>
                        <div class="chat-super flex flex-col items-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="flex items-center gap-5 p-be-10">
                                    <common-element-wrapper
                                        size={36}
                                        color="var(--primary-color)"
                                        name="nest-issues-chat"
                                    ></common-element-wrapper>
                                    <n-text class="text-18" strong>
                                        {t('home.facts.brand')}
                                    </n-text>
                                </div>
                                <n-h1 class="m-0 text-center text-size-[var(--chat-super-title-size)]">
                                    {t('home.facts.sloganBefore')}
                                    <br />
                                    {t('home.facts.sloganAfter')}
                                </n-h1>
                            </div>
                            <n-button class="min-w-120" size="large" type="primary">
                                <n-text>{t('home.facts.action')}</n-text>
                            </n-button>
                        </div>
                    </n-card>
                </div>
            </n-element>
        )
    }
})
</script>

<style lang="scss" scoped>
.facts-box {
    --facts-box-title-size: 28px;
    position: relative;
    padding-block: 120px;
    margin-block-end: 48px;
    @media (max-width: 960px) {
        --facts-box-title-size: 24px;
        padding-block: 60px;
    }
    @media (max-width: 580px) {
        margin-block-end: 0;
    }
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('@/assets/images/shape.png');
    }
    .chat-hot {
        text-align: center;
        color: var(--primary-color);
        line-height: 24px;
        text-transform: uppercase;
    }
    .chat-element {
        --chat-element-title-size: 40px;
        grid-template-columns: repeat(4, minmax(0px, 1fr));
        position: relative;
        @media (max-width: 1024px) {
            --chat-element-title-size: 28px;
            gap: 48px;
            grid-template-columns: repeat(2, minmax(0px, 1fr));
        }
        @media (max-width: 580px) {
            grid-template-columns: repeat(1, minmax(0px, 1fr));
        }
    }
}

.chat-super {
    --chat-super-title-size: 36px;
    position: relative;
    padding: 60px;
    gap: 48px;
    &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        height: 100%;
        width: 34.875rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        // background-image: url('https://cn.spugsms.com/assets/images/shape/y.png');
    }
    &::after {
        position: absolute;
        right: 0;
        top: 0;
        content: '';
        height: 100%;
        width: 34.875rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        // background-image: url('https://cn.spugsms.com/assets/images/shape/z.png');
    }
    @media (max-width: 1080px) {
        &::after,
        &::before {
            display: none;
        }
    }
    @media (max-width: 760px) {
        --chat-super-title-size: 28px;
        padding: 40px;
    }
    @media (max-width: 580px) {
        --chat-super-title-size: 22px;
        padding: 24px;
        gap: 32px;
    }
}

.chat-super-card {
    --n-border-radius: 12px;
    margin-block-end: 80px;
    &.is-light {
        --n-color-embedded: #0a1425;
        .n-h,
        .n-text {
            --n-text-color: var(--n-color-modal);
        }
    }
    @media (max-width: 580px) {
        margin-block-end: 48px;
    }
    :deep(.n-card__content) {
        padding: 0;
    }
}
</style>
