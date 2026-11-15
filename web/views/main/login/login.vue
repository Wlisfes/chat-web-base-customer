<script lang="tsx">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nContext } from '@/i18n'
import { useCodeService, useFormService } from '@/hooks'
import { useGlobal, useStore } from '@/store'
import * as Service from '@/api'

export default defineComponent({
    name: 'MainLogin',
    setup() {
        const router = useRouter()
        const { t } = useI18nContext()
        const { fetchApplyLogin } = useStore(useGlobal)
        const { link, loading, error, fetchRefresh, fetchComplete, fetchError } = useCodeService({
            inverse: 1
        })
        const { formRef, formState, state, setState, fetchValidater } = useFormService({
            formState: {
                email: '',
                password: '',
                code: ''
            },
            rules: {
                email: { required: true, trigger: 'blur', message: t('auth.login.emailRule') },
                password: { required: true, trigger: 'blur', min: 6, max: 18, message: t('auth.login.passwordRule') },
                code: { required: true, trigger: 'blur', message: t('auth.login.codeRule') }
            }
        })

        async function fetchSubmit() {
            return await fetchValidater().then(async error => {
                if (error) {
                    return await setState({ loading: false, disabled: false })
                }
                try {
                    const { data } = await Service.httpAuthAccountToken({
                        accountType: 'crm',
                        email: formState.value.email,
                        password: formState.value.password,
                        code: formState.value.code
                    })
                    await fetchApplyLogin(data)
                    return await router.push({ path: '/', replace: true })
                } catch (error) {
                    return await setState({ loading: false, disabled: false }).then(async () => {
                        return await fetchRefresh()
                    })
                }
            })
        }

        return () => (
            <n-element class="w-full select-none">
                <n-form size="large" ref={formRef} model={formState.value} rules={state.rules} disabled={state.loading} show-label={false}>
                    <n-form-item path="email">
                        <form-element-input
                            maxlength={64}
                            type="text"
                            placeholder={t('auth.login.email')}
                            v-model:value={formState.value.email}
                            input-props={{ autocomplete: 'on' }}
                            prefix={{ name: 'nest-unset-user', size: 22 }}
                            onSubmit={fetchSubmit}
                        ></form-element-input>
                    </n-form-item>
                    <n-form-item path="password">
                        <form-element-input
                            maxlength={32}
                            placeholder={t('auth.login.password')}
                            type="password"
                            show-password-on="click"
                            input-props={{ autocomplete: 'password' }}
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
                                placeholder={t('auth.login.code')}
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
                            {t('auth.login.submit')}
                        </common-element-button>
                    </n-form-item>
                    <div class="flex flex-1 items-center justify-between">
                        <div class="flex items-center">
                            <n-text class="text-#eef3ffad">{t('auth.login.noAccount')}</n-text>
                            <router-link to="/main/register">
                                <n-button text type="primary" focusable={false}>
                                    {t('auth.login.register')}
                                </n-button>
                            </router-link>
                        </div>
                        <router-link to="/main/register">
                            <n-button text type="primary" focusable={false}>
                                {t('auth.login.forgot')}
                            </n-button>
                        </router-link>
                    </div>
                </n-form>
            </n-element>
        )
    }
})
</script>
