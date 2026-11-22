<script lang="tsx">
import { computed, defineComponent, ref } from 'vue'
import { SMS_TYPE_OPTIONS, useSmsState } from '@/views/sms/sms.data'

const trend = [92, 104, 98, 121, 116, 128, 134]
const failures = [
    ['空号或停机 (DELIVRD_EMPTY)', 2140, 43.8],
    ['触发运营商频控 (RATE_LIMIT)', 1120, 22.9],
    ['用户主动退订黑名单 (BLACKLIST)', 840, 17.2],
    ['关机或不在服务区超时 (TIMEOUT)', 512, 10.5],
    ['签名格式异常拦截 (SIGN_INVALID)', 274, 5.6]
]

export default defineComponent({
    name: 'WebSmsStat',
    setup() {
        const state = useSmsState()
        const range = ref('7d')
        const typeCounts = computed(() => SMS_TYPE_OPTIONS.map(item => ({ ...item, count: state.templates.filter(template => template.type === item.value).length * 80000 + 34000 })))
        return () => (
            <div class="sms-page">
                <header class="sms-head"><div><h2>发送数据统计</h2><p>全方位监控通道送达率、模板类型分布与失败原因</p></div>
                    <n-radio-group v-model:value={range.value}><n-radio-button value="1d">今日</n-radio-button><n-radio-button value="7d">近 7 天</n-radio-button><n-radio-button value="30d">近 30 天</n-radio-button></n-radio-group>
                </header>
                <n-card>
                    <div class="sms-card__title">发送量趋势<span>{range.value === '1d' ? '今日 128,450 条' : '近 7 天总计 814,290 条 · 环比 +8.6%'}</span></div>
                    <div class="sms-bars">{trend.map((value, index) => <div key={index}><i style={{ height: (range.value === '1d' ? value * 0.4 : value) + 'px' }}></i><span>11-{15 + index}</span></div>)}</div>
                </n-card>
                <div class="sms-grid">
                    <n-card><div class="sms-card__title">发送成功率分布</div><strong>99.4%</strong><p>平均送达率</p><p>发送成功 809,404 (99.4%)</p><p>发送失败 4,886 (0.6%)</p></n-card>
                    <n-card><div class="sms-card__title">模板类型分布</div>{typeCounts.value.map(item => <div class="sms-row" key={item.value}><span>{item.label}</span><i style={{ width: item.count / 5000 + 'px' }}></i><em>{Math.round(item.count / 1000)}k</em></div>)}</n-card>
                    <n-card><div class="sms-card__title">失败原因 Top 5</div>{failures.map((item, index) => <div class="sms-fail" key={item[0]}><span>{index + 1}. {item[0]}</span><em>{item[1]} 条 ({item[2]}%)</em><i style={{ width: item[2] + '%' }}></i></div>)}</n-card>
                </div>
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-page { display: flex; flex-direction: column; gap: 16px; }
.sms-head { display: flex; justify-content: space-between; align-items: center; }
.sms-head h2 { margin: 0; }
.sms-head p, .sms-card__title span, .sms-card p { color: var(--text-color-3); font-size: 13px; }
.sms-card { background: var(--card-color); border: 1px solid var(--border-color); border-radius: 4px; padding: 16px; }
.sms-card__title { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 600; }
.sms-card strong { font-size: 32px; color: var(--primary-color); }
.sms-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.sms-bars { display: flex; align-items: flex-end; gap: 16px; height: 160px; }
.sms-bars div { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.sms-bars i, .sms-row i, .sms-fail i { display: block; background: var(--primary-color); border-radius: 3px; }
.sms-bars i { width: 28px; }
.sms-row, .sms-fail { display: grid; grid-template-columns: 72px 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 13px; }
.sms-fail { grid-template-columns: 1fr auto; }
.sms-fail i { grid-column: 1 / -1; height: 6px; }
.sms-row i { height: 8px; }
</style>
