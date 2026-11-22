<script lang="tsx">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { maskPhone, SMS_STATUS_OPTIONS, useSmsSummary } from '@/views/sms/sms.data'

const trend = [92, 104, 98, 121, 116, 128, 134]

export default defineComponent({
    name: 'WebSmsHome',
    setup() {
        const router = useRouter()
        const { state } = useSmsSummary()
        return () => (
            <div class="sms-page">
                <header class="sms-head">
                    <div>
                        <h2>首页概览工作台</h2>
                        <p>生产通道正常</p>
                    </div>
                </header>
                <div class="sms-kpis">
                    <n-card size="small"><span>今日发送量</span><strong>128,450</strong><em>+12.4%</em></n-card>
                    <n-card size="small"><span>发送成功率</span><strong>99.42%</strong><em>较昨日 +0.18%</em></n-card>
                    <n-card size="small"><span>账户余额</span><strong>¥{state.amount.toLocaleString()}</strong><em>余量 {state.balance.toLocaleString()} 条</em></n-card>
                    <n-card size="small"><span>待发送任务</span><strong>{state.tasks.filter(item => item.status === 'scheduled').length}</strong><a onClick={() => router.push('/web/sms/task')}>查看队列</a></n-card>
                </div>
                <n-card>
                    <div class="sms-card__title">近 7 天发送量趋势<span>累计发送 814,290 条 · 日均到达率 99.38%</span></div>
                    <div class="sms-bars">
                        {trend.map((value, index) => (
                            <div key={index}>
                                <i style={{ height: value + 'px' }}></i>
                                <span>11-{15 + index}</span>
                            </div>
                        ))}
                    </div>
                </n-card>
                <n-card>
                    <div class="sms-card__title">快捷操作</div>
                    <div class="sms-actions">
                        <n-button class="sms-action" quaternary onClick={() => router.push('/web/sms/send')}>发送短信<br /><small>选择应用与模板快速下发</small></n-button>
                        <n-button class="sms-action" quaternary onClick={() => router.push('/web/sms/template')}>新建模板<br /><small>配置验证码或通知模板</small></n-button>
                        <n-button class="sms-action" quaternary onClick={() => router.push('/web/sms/file')}>上传号码文件<br /><small>支持 CSV / TXT 批量导入</small></n-button>
                    </div>
                </n-card>
                <n-card>
                    <div class="sms-card__title">最近发送记录<a onClick={() => router.push('/web/sms/record')}>查看全部</a></div>
                    <n-data-table
                        size="small"
                        columns={[
                            { title: '手机号', key: 'phone', render: (row: Omix) => maskPhone(row.phone) },
                            { title: '所属应用', key: 'appName' },
                            { title: '模板', key: 'templateName' },
                            { title: '发送状态', key: 'status', render: (row: Omix) => <n-tag size="small" type={SMS_STATUS_OPTIONS.find(item => item.value === row.status)?.type}>{SMS_STATUS_OPTIONS.find(item => item.value === row.status)?.label}</n-tag> },
                            { title: '发送时间', key: 'sendTime' }
                        ]}
                        data={state.records.slice(0, 5)}
                    />
                </n-card>
            </div>
        )
    }
})
</script>
<style lang="scss" scoped>
.sms-page { display: flex; flex-direction: column; gap: 16px; }
.sms-head h2 { margin: 0; font-size: 20px; color: var(--text-color-1); }
.sms-head p, .sms-card__title span, .sms-card__title a, small { color: var(--text-color-3); font-size: 13px; }
.sms-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.sms-kpis article, .sms-card { background: var(--card-color); border: 1px solid var(--border-color); border-radius: 4px; padding: 16px; }
.sms-kpis span { color: var(--text-color-3); font-size: 13px; }
.sms-kpis strong { display: block; margin: 8px 0 4px; font-size: 24px; }
.sms-kpis em, .sms-kpis a { color: var(--primary-color); font-style: normal; font-size: 12px; cursor: pointer; }
.sms-card__title { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 600; }
.sms-bars { display: flex; align-items: flex-end; gap: 18px; height: 160px; }
.sms-bars div { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
.sms-bars i { width: 28px; border-radius: 3px 3px 0 0; background: var(--primary-color); }
.sms-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.sms-actions button { text-align: left; padding: 16px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--hover-color); cursor: pointer; }
.sms-actions button:hover { border-color: var(--primary-color); }
</style>
