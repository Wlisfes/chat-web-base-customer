<script lang="tsx">
import { defineComponent, computed, PropType } from 'vue'
import { fetchShrinkNumber, fetchZoomNumber } from '@/utils'
import big from 'big.js'

export default defineComponent({
    name: 'CommonBaseNumber',
    props: {
        /**传入金额**/
        value: { type: [String, Number] as PropType<string | number>, default: 0 },
        /**小数精度**/
        precision: { type: Number as PropType<number>, default: 6 },
        /**金额缩小**/
        shrink: { type: Boolean, default: false },
        /**金额放大**/
        zoom: { type: Boolean, default: false },
        /**转换倍率**/
        bit: { type: Number as PropType<number>, default: 1000000 }
    },
    setup(props) {
        /**按转换模式处理后的数字**/
        const value = computed(() => {
            if (props.shrink) {
                return fetchShrinkNumber(props.value, props.bit)
            } else if (props.zoom) {
                return fetchZoomNumber(props.value, props.bit)
            }
            return Number(props.value || 0)
        })
        /**按精度截断并分割整数、小数（截断不四舍五入，避免金额显示偏大）**/
        const node = computed(() => {
            const [integer, decimal = ''] = new big(Number.isFinite(value.value) ? value.value : 0)
                .round(props.precision, big.roundDown)
                .toFixed(props.precision)
                .split('.')
            return { integer, decimal }
        })

        return () => (
            <div class="common-base-number flex-inline items-end">
                <n-text depth={1}>{node.value.integer}</n-text>
                {props.precision > 0 && (
                    <n-text class="text-14" depth={3}>
                        {`.${node.value.decimal}`}
                    </n-text>
                )}
            </div>
        )
    }
})
</script>
