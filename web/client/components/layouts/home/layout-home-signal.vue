<script lang="tsx">
import { defineComponent } from 'vue'
import { useState } from '@webpack/hooks'

export default defineComponent({
    name: 'LayoutHomeSignal',
    setup() {
        const { state } = useState({
            metrics: [
                { value: '190+', label: '国家 / 地区', hint: '出海覆盖' },
                { value: '800+', label: '运营商网络', hint: '多通道聚合' },
                { value: '<1s', label: '触达响应', hint: '实时路由' },
                { value: '99.9%', label: '通道可用', hint: '故障切换' }
            ],
            steps: [
                { index: '01', title: '接入', document: '后台或 API 提交任务，模板、号码和发送窗口一次配置。' },
                { index: '02', title: '路由', document: '按国家、运营商和内容策略选择通道，异常时自动分流。' },
                { index: '03', title: '发送', document: '分布式节点并发下发，验证码、通知和营销短信分开排队。' },
                { index: '04', title: '回执', document: '到达、失败和退订实时回传，报表按任务、通道和国家拆开。' }
            ],
            chips: ['HTTP API', '独立后台', '国际短信', '三网发送', '实时回执', '可视化报表', '权限隔离', '通道监控']
        })

        return () => (
            <n-element class="layout-home-signal common-width-inline">
                <div class="signal-panel">
                    <div class="signal-grid"></div>
                    <div class="signal-glow"></div>
                    <div class="signal-head">
                        <n-text class="signal-kicker">SIGNAL MESH</n-text>
                        <h2>一条链路，把发送、路由和回执收在同一张网上</h2>
                        <p>常见问题下面不再留白。通道状态、发送步骤和支持范围直接铺在这里，方便先看能力，再往下看问答。</p>
                    </div>
                    <div class="metric-row">
                        {state.metrics.map(item => (
                            <div class="metric" key={item.label}>
                                <span>{item.hint}</span>
                                <strong>{item.value}</strong>
                                <em>{item.label}</em>
                            </div>
                        ))}
                    </div>
                    <div class="step-row">
                        {state.steps.map(item => (
                            <div class="step" key={item.index}>
                                <b>{item.index}</b>
                                <h3>{item.title}</h3>
                                <p>{item.document}</p>
                            </div>
                        ))}
                    </div>
                    <div class="chip-row">
                        {state.chips.map(item => (
                            <span key={item}>{item}</span>
                        ))}
                    </div>
                </div>
            </n-element>
        )
    }
})
</script>

<style lang="scss" scoped>
.layout-home-signal {
    padding-block: 12px 36px;
}

.signal-panel {
    position: relative;
    overflow: hidden;
    padding: 36px;
    border-radius: 18px;
    color: #eef3ff;
    background:
        radial-gradient(circle at 12% 0%, rgba(83, 109, 254, 0.45), transparent 32%),
        linear-gradient(135deg, #0d1428 0%, #151c36 58%, #10182e 100%);
    box-shadow: 0 24px 60px rgba(18, 28, 68, 0.16);
}

.signal-grid,
.signal-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.signal-grid {
    background-image:
        linear-gradient(rgba(140, 168, 255, 0.14) 1px, transparent 1px),
        linear-gradient(90deg, rgba(140, 168, 255, 0.14) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 92%);
}

.signal-glow {
    background: radial-gradient(circle at 88% 18%, rgba(88, 214, 255, 0.22), transparent 26%);
}

.signal-head,
.metric-row,
.step-row,
.chip-row {
    position: relative;
    z-index: 1;
}

.signal-kicker {
    color: #8eb6ff;
    letter-spacing: 0.16em;
    font-size: 12px;
}

.signal-head h2 {
    max-width: 720px;
    margin: 8px 0 10px;
    font-size: 28px;
    line-height: 1.35;
}

.signal-head p,
.step p {
    margin: 0;
    color: rgba(238, 243, 255, 0.72);
    line-height: 1.7;
}

.metric-row,
.step-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 28px;
}

.metric,
.step {
    min-height: 132px;
    padding: 18px;
    border: 1px solid rgba(164, 188, 255, 0.18);
    border-radius: 14px;
    background: rgba(8, 14, 32, 0.38);
    backdrop-filter: blur(8px);
}

.metric span,
.step b {
    color: #8eb6ff;
    font-size: 12px;
    letter-spacing: 0.08em;
}

.metric strong {
    display: block;
    margin: 10px 0 4px;
    font-size: 32px;
    line-height: 1;
}

.metric em {
    color: rgba(238, 243, 255, 0.78);
    font-style: normal;
}

.step h3 {
    margin: 10px 0 8px;
    font-size: 18px;
}

.chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;
}

.chip-row span {
    padding: 7px 12px;
    border: 1px solid rgba(142, 182, 255, 0.28);
    border-radius: 999px;
    color: #d7e4ff;
    background: rgba(83, 109, 254, 0.16);
    font-size: 13px;
}

@media (max-width: 1080px) {
    .metric-row,
    .step-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .signal-panel {
        padding: 22px;
    }

    .metric-row,
    .step-row {
        grid-template-columns: 1fr;
    }
}
</style>