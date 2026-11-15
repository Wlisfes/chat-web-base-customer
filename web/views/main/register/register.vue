<script lang="tsx">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useCodeService, useFormService } from '@/hooks'
import { useGlobal, useStore } from '@/store'
import * as Service from '@/api'

export default defineComponent({
    name: 'MainRegister',
    setup() {
        const router = useRouter()
        const { fetchApplyLogin } = useStore(useGlobal)
        const { link, loading: captchaLoading, error: captchaError, fetchRefresh, fetchComplete, fetchError } = useCodeService()
        const { formRef, formState, state, setState, fetchValidater } = useFormService({
            formState: {
                nickname: '',
                email: '',
                password: '',
                code: ''
            },
            rules: {
                nickname: { required: true, trigger: 'blur', message: '请输入昵称' },
                email: { required: true, trigger: 'blur', type: 'email', message: '请输入正确的邮箱' },
                password: { required: true, trigger: 'blur', min: 6, max: 18, message: '请输入6~18位登录密码' },
                code: { required: true, trigger: 'blur', len: 4, message: '请输入4位验证码' }
            }
        })

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
                <n-form size="large" ref={formRef} model={formState.value} rules={state.rules} disabled={state.loading} show-label={false}>
                    <n-form-item path="nickname">
                        <form-element-input
                            maxlength={32}
                            type="text"
                            placeholder="请输入昵称"
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
                            placeholder="请输入邮箱"
                            v-model:value={formState.value.email}
                            input-props={{ autocomplete: 'email' }}
                            prefix={{ name: 'nest-unset-user', size: 22 }}
                            onSubmit={fetchSubmit}
                        ></form-element-input>
                    </n-form-item>
                    <n-form-item path="password">
                        <form-element-input
                            maxlength={32}
                            placeholder="请输入密码"
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
                                placeholder="验证码"
                                maxlength={4}
                                v-model:value={formState.value.code}
                                prefix={{ name: 'nest-unset-codex', size: 22 }}
                                onSubmit={fetchSubmit}
                            ></form-element-input>
                            <common-base-codex
                                link={link.value}
                                loading={captchaLoading.value}
                                error={captchaError.value}
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
                            立即注册
                        </common-element-button>
                    </n-form-item>
                    <div class="flex items-center justify-center">
                        <n-text>已有账号？</n-text>
                        <router-link to="/main/login">
                            <n-button text type="primary" focusable={false}>
                                去登录
                            </n-button>
                        </router-link>
                    </div>
                </n-form>
            </n-element>
        )
    }
})
</script>
