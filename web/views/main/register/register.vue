<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nContext } from '@/i18n'
import { useCodeService, useFormService } from '@/hooks'
import { useGlobal, useStore } from '@/store'
import * as Service from '@/api'

export default defineComponent({
    name: 'MainRegister',
    setup() {
        const router = useRouter()
        const { t } = useI18nContext()
        const { fetchApplyLogin } = useStore(useGlobal)
        const { link, loading, error, fetchRefresh, fetchComplete, fetchError } = useCodeService({
            inverse: 1
        })
        const { formRef, formState, state, setState, fetchValidater } = useFormService({
            formState: {
                nickname: '',
                email: '',
                password: '',
                code: ''
            }
        })
        const rules = computed(() => ({
            nickname: { required: true, trigger: 'blur', message: t('auth.register.nicknameRule') },
            email: { required: true, trigger: 'blur', type: 'email', message: t('auth.register.emailRule') },
            password: { required: true, trigger: 'blur', min: 6, max: 18, message: t('auth.register.passwordRule') },
            code: { required: true, trigger: 'blur', len: 4, message: t('auth.register.codeRule') }
        }))

        async function fetchSubmit() {
            return await fetchValidater().then(async error => {
                if (error) {
                    return await setState({ loading: false, disabled: false })
                }
                try {
                    return await Service.httpAuthAccountTokenRegister({
                        nickname: formState.value.nickname,
                        email: formState.value.email,
                        password: formState.value.password,
                        code: formState.value.code
                    }).then(async ({ data }) => {
                        await fetchApplyLogin(data)
                        return await router.push({ path: '/', replace: true })
                    })
                } catch (error) {
                    return await setState({ loading: false, disabled: false }).then(async () => {
                        return await fetchRefresh()
                    })
                }
            })
        }

        return () => (
            <n-element class="w-full select-none">
                <n-form size="large" ref={formRef} model={formState.value} rules={rules.value} disabled={state.loading} show-label={false}>
                    <n-form-item path="nickname">
                        <form-element-input
                            maxlength={32}
                            type="text"
                            placeholder={t('auth.register.nickname')}
                            v-model:value={formState.value.nickname}
                            input-props={{ autocomplete: 'nickname' }}
                            prefix={{ name: 'nest-unset-user', size: 20 }}
                            onSubmit={fetchSubmit}
                        ></form-element-input>
                    </n-form-item>
                    <n-form-item path="email">
                        <form-element-input
                            maxlength={64}
                            type="text"
                            placeholder={t('auth.register.email')}
                            v-model:value={formState.value.email}
                            input-props={{ autocomplete: 'email' }}
                            prefix={{ name: 'nest-unset-user', size: 22 }}
                            onSubmit={fetchSubmit}
                        ></form-element-input>
                    </n-form-item>
                    <n-form-item path="password">
                        <form-element-input
                            maxlength={32}
                            placeholder={t('auth.register.password')}
                            type="password"
                            show-password-on="click"
                            input-props={{ autocomplete: 'new-password' }}
                            style={{ '--input-password-right': '46px' }}
                            v-model:value={formState.value.password}
                            prefix={{ name: 'nest-unset-ockes', size: 22 }}
                            onSubmit={fetchSubmit}
                        ></form-element-input>
                    </n-form-item>
                    <n-form-item path="code">
                        <div class="flex flex-1 items-center gap-12 overflow-hidden">
                            <form-element-input
                                class="flex-1"
                                type="text"
                                placeholder={t('auth.register.code')}
                                maxlength={4}
                                v-model:value={formState.value.code}
                                prefix={{ name: 'nest-unset-codex', size: 22 }}
                                onSubmit={fetchSubmit}
                            ></form-element-input>
                            <common-base-codex
                                link={link.value}
                                loading={loading.value}
                                error={error.value}
                                disabled={state.loading}
                                onClick={fetchRefresh}
                                onComplete={fetchComplete}
                                onError={fetchError}
                            ></common-base-codex>
                        </div>
                    </n-form-item>
                    <n-form-item>
                        <common-element-button
                            class="w-full"
                            type="info"
                            disabled={state.loading}
                            loading={state.loading}
                            onClick={fetchSubmit}
                        >
                            {t('auth.register.submit')}
                        </common-element-button>
                    </n-form-item>
                    <div class="flex items-center justify-center">
                        <n-text class="text-#eef3ffad">{t('auth.register.hasAccount')}</n-text>
                        <router-link to="/main/login">
                            <n-button text type="primary" focusable={false}>
                                {t('auth.register.login')}
                            </n-button>
                        </router-link>
                    </div>
                </n-form>
            </n-element>
        )
    }
})
</script>
