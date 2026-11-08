<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CommonBaseCodex',
    emits: ['click', 'complete', 'error'],
    props: {
        /**加载状态**/
        loading: { type: Boolean, default: true },
        /**禁用状态**/
        disabled: { type: Boolean, default: false },
        /**加载失败状态**/
        error: { type: Boolean, default: false },
        /**图形验证码地址**/
        link: { type: String, required: true }
    },
    setup(props, { emit }) {
        return () => (
            <n-spin class="common-base-codex" size="small" content-class="flex flex-col" show={props.loading}>
                <common-base-button
                    class="p-0"
                    size="large"
                    secondary
                    disabled={props.loading || props.disabled}
                    aria-label={props.error ? '验证码加载失败，点击重试' : '点击刷新验证码'}
                    onClick={() => emit('click', 0)}
                >
                    {props.error ? (
                        <n-text class="w-120 h-40 flex justify-center items-center text-12" depth={3}>
                            加载失败，点击重试
                        </n-text>
                    ) : (
                        <n-image
                            class="w-120 h-40 flex flex-col"
                            width={120}
                            height={40}
                            preview-disabled
                            src={props.link}
                            imgProps={{ crossOrigin: 'use-credentials' }}
                            on-load={() => emit('complete', 100)}
                            on-error={() => emit('error', 100)}
                        >
                            {{
                                placeholder: () => (
                                    <n-skeleton width={120} height={40} style={{ borderRadius: 'var(--n-border-radius)' }}></n-skeleton>
                                )
                            }}
                        </n-image>
                    )}
                </common-base-button>
            </n-spin>
        )
    }
})
</script>
