<script lang="tsx">
import { defineComponent, Transition } from 'vue'

/**
 * 加载图标：从 naive-ui 内部组件 BaseLoading 抽离，与输入框 loading 的旋转动画一致。
 * show 为 true 时显示旋转动画，否则显示默认插槽内容（如日期图标），切换时带缩放淡入淡出过渡。
 */
export default defineComponent({
    name: 'CommonInternalLoading',
    props: {
        /**是否显示加载动画**/
        show: { type: Boolean, default: true },
        /**线条宽度**/
        strokeWidth: { type: Number, default: 28 },
        /**线条颜色，默认继承文字颜色**/
        stroke: { type: String },
        /**缩放比例**/
        scale: { type: Number, default: 1 },
        /**半径**/
        radius: { type: Number, default: 100 }
    },
    setup(props, { slots }) {
        const duration = '1.6s'
        return () => {
            const { radius, strokeWidth, stroke, scale } = props
            const scaled = radius / scale
            return (
                <div class="common-internal-loading" role="img" aria-label="loading">
                    <Transition name="common-internal-loading-switch">
                        {props.show ? (
                            <div key="icon" class="common-internal-loading__wrapper">
                                <div class="common-internal-loading__container">
                                    <svg
                                        class="common-internal-loading__icon"
                                        viewBox={`0 0 ${2 * scaled} ${2 * scaled}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ color: stroke }}
                                    >
                                        <g>
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                values={`0 ${scaled} ${scaled};270 ${scaled} ${scaled}`}
                                                begin="0s"
                                                dur={duration}
                                                fill="freeze"
                                                repeatCount="indefinite"
                                            />
                                            <circle
                                                class="common-internal-loading__icon"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width={strokeWidth}
                                                stroke-linecap="round"
                                                cx={scaled}
                                                cy={scaled}
                                                r={radius - strokeWidth / 2}
                                                stroke-dasharray={5.67 * radius}
                                                stroke-dashoffset={18.48 * radius}
                                            >
                                                <animateTransform
                                                    attributeName="transform"
                                                    type="rotate"
                                                    values={`0 ${scaled} ${scaled};135 ${scaled} ${scaled};450 ${scaled} ${scaled}`}
                                                    begin="0s"
                                                    dur={duration}
                                                    fill="freeze"
                                                    repeatCount="indefinite"
                                                />
                                                <animate
                                                    attributeName="stroke-dashoffset"
                                                    values={`${5.67 * radius};${1.42 * radius};${5.67 * radius}`}
                                                    begin="0s"
                                                    dur={duration}
                                                    fill="freeze"
                                                    repeatCount="indefinite"
                                                />
                                            </circle>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div key="placeholder" class="common-internal-loading__placeholder">
                                {slots.default?.()}
                            </div>
                        )}
                    </Transition>
                </div>
            )
        }
    }
})
</script>

<style lang="scss" scoped>
@keyframes common-internal-loading-rotator {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.common-internal-loading {
    position: relative;
    line-height: 0;
    width: 1em;
    height: 1em;
    .common-internal-loading__wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .common-internal-loading__placeholder {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        &.common-internal-loading-switch-enter-from,
        &.common-internal-loading-switch-leave-to {
            transform: translateX(-50%) translateY(-50%) scale(0.75);
        }
        &.common-internal-loading-switch-enter-to,
        &.common-internal-loading-switch-leave-from {
            transform: scale(1) translateX(-50%) translateY(-50%);
        }
    }
    .common-internal-loading__container {
        animation: common-internal-loading-rotator 3s linear infinite both;
    }
    .common-internal-loading__icon {
        width: 1em;
        height: 1em;
    }
    /**图标切换过渡：缩放 + 淡入淡出**/
    .common-internal-loading__wrapper.common-internal-loading-switch-enter-from,
    .common-internal-loading__wrapper.common-internal-loading-switch-leave-to {
        transform: scale(0.75);
    }
    .common-internal-loading-switch-enter-from,
    .common-internal-loading-switch-leave-to {
        opacity: 0;
    }
    .common-internal-loading-switch-enter-to,
    .common-internal-loading-switch-leave-from {
        opacity: 1;
    }
    .common-internal-loading-switch-enter-active,
    .common-internal-loading-switch-leave-active {
        transform-origin: center;
        position: absolute;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
}
</style>
