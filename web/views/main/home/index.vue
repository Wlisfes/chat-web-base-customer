<script lang="tsx">
import { defineComponent, ref } from 'vue'

const curl = `curl -X POST https://api.omnipulse.cloud/v2/dispatch \\
-H "Authorization: Bearer op_live_839a2f7c0019e" \\
-d '{"channel": "email", "to": "test@sample.com"}'`

const sdk: Record<string, { install: string; sample: string }> = {
    'Node.js': {
        install: 'npm install omnipulse-sdk',
        sample: 'const client = omnipulse.Client({ api_key: "pk_live_..." })'
    },
    Python: {
        install: 'pip install omnipulse-sdk',
        sample: 'client = omnipulse.Client(api_key="pk_live_...")'
    },
    Java: {
        install: 'implementation "cloud.omnipulse:sdk:2.8.0"',
        sample: 'Client client = new Client("pk_live_...");'
    },
    Go: {
        install: 'go get github.com/omnipulse/sdk-go',
        sample: 'client := omnipulse.New("pk_live_...")'
    }
}

export default defineComponent({
    name: 'Home',
    async httpServer() {},
    setup() {
        const lang = ref('Python')

        async function copyCurl() {
            await navigator.clipboard?.writeText(curl.replace(/\\\n/g, '\n'))
        }

        function heading(text: string, extra?: string) {
            return (
                <div class="flex items-center gap-8 min-w-0">
                    <i class="w-3 h-14 rounded-2 bg-[var(--primary-color)] shrink-0"></i>
                    <n-text class="text-16 whitespace-nowrap">{text}</n-text>
                    {extra ? <n-text depth={3}>{extra}</n-text> : null}
                </div>
            )
        }

        return () => (
            <common-base-element class="flex flex-col flex-1 gap-14 p-20 max-w-1480 m-inline-auto w-full">
                <n-card content-class="flex flex-col gap-14">
                    <div class="flex items-start justify-between gap-16">
                        <div class="flex flex-col gap-10 min-w-0">
                            <div class="flex items-center gap-8 flex-wrap">
                                <common-base-chunk type="success">标准企业实名已通过</common-base-chunk>
                                <common-base-chunk type="success">亚太沙箱集群 SG-01 正常</common-base-chunk>
                            </div>
                            <div class="flex items-center gap-10 flex-wrap">
                                <n-text class="text-28 font-700">Alex Zhang</n-text>
                                <n-text depth={3}>租户ID: org_apac_983109 · 杭州科技有限公司</n-text>
                                <common-base-chunk>代码: 91330100MA28XXXX3R</common-base-chunk>
                                <common-base-chunk>CNY · GMT+8</common-base-chunk>
                            </div>
                        </div>
                        <div class="flex items-center gap-8 shrink-0">
                            <common-base-button>API 凭证</common-base-button>
                            <common-base-button type="primary">快速联调自测</common-base-button>
                        </div>
                    </div>
                    <n-card embedded content-class="flex items-center justify-between gap-12">
                        <div class="flex items-center gap-8 flex-wrap min-w-0">
                            <n-text depth={3}>企业资质核验状态：</n-text>
                            <common-base-chunk type="primary">基础资质已核验</common-base-chunk>
                            <n-text depth={3}>已授权邮件与沙箱通道，短信需补充电信增值业务 SP 资质报备</n-text>
                        </div>
                        <n-button text type="primary">
                            完善增值资质
                        </n-button>
                    </n-card>
                </n-card>

                <n-card content-class="flex flex-col gap-14">
                    <div class="flex items-center justify-between gap-12">
                        {heading('多通道产品服务矩阵')}
                        <n-text depth={3}>1/4 运行中 · 2 配置中 · 1 未激活</n-text>
                    </div>
                    <div class="grid grid-cols-4 gap-12 max-[1280px]:grid-cols-2 max-[760px]:grid-cols-1">
                        <n-card class="h-full" size="small" content-class="flex flex-col gap-12 h-full">
                            <div class="flex items-start justify-between gap-8">
                                <div>
                                    <n-text class="block">邮件服务</n-text>
                                    <n-text depth={3}>[EML-PRO]</n-text>
                                </div>
                                <common-base-chunk type="success">已启用</common-base-chunk>
                            </div>
                            <div class="flex items-start justify-between gap-12">
                                <div>
                                    <n-text depth={3} class="block">
                                        今日轻量调用
                                    </n-text>
                                    <n-text class="text-22 font-700">328 封</n-text>
                                </div>
                                <div class="text-right">
                                    <n-text depth={3} class="block">
                                        投递成功率
                                    </n-text>
                                    <n-text type="success" class="text-22 font-700">
                                        99.4%
                                    </n-text>
                                </div>
                            </div>
                            <div class="flex items-center justify-between gap-8 m-bs-auto">
                                <n-text type="success">DKIM已生效</n-text>
                                <n-button text type="primary">
                                    发信控制台
                                </n-button>
                            </div>
                        </n-card>
                        <n-card class="h-full" size="small" content-class="flex flex-col gap-12 h-full">
                            <div class="flex items-start justify-between gap-8">
                                <div>
                                    <n-text class="block">短信网关</n-text>
                                    <n-text depth={3}>[SMS-DIR]</n-text>
                                </div>
                                <common-base-chunk type="purple">审核中</common-base-chunk>
                            </div>
                            <n-text depth={2}>
                                资质状态
                                <n-text depth={3} class="block">
                                    企业签名已提交，报备核验中
                                </n-text>
                                <n-text depth={3} class="block">
                                    预计审核耗时: 今日 18:00 前
                                </n-text>
                            </n-text>
                            <div class="flex items-center justify-between gap-8 m-bs-auto">
                                <n-text depth={3}>资质审核中</n-text>
                                <n-button text type="primary">
                                    报备进度
                                </n-button>
                            </div>
                        </n-card>
                        <n-card class="h-full" size="small" content-class="flex flex-col gap-12 h-full">
                            <div class="flex items-start justify-between gap-8">
                                <div>
                                    <n-text class="block">WhatsApp</n-text>
                                    <n-text depth={3}>[WA-BIZ]</n-text>
                                </div>
                                <common-base-chunk type="error">待配置</common-base-chunk>
                            </div>
                            <n-text depth={2}>
                                官方接入状态
                                <n-text depth={3} class="block">
                                    未绑定 Meta WABA 商业号
                                </n-text>
                                <n-text depth={3} class="block">
                                    支持一键嵌入式 Meta 授权
                                </n-text>
                            </n-text>
                            <div class="flex items-center justify-between gap-8 m-bs-auto">
                                <n-text depth={3}>需授权</n-text>
                                <n-button text type="primary">
                                    绑定向导
                                </n-button>
                            </div>
                        </n-card>
                        <n-card class="h-full" size="small" content-class="flex flex-col gap-12 h-full">
                            <div class="flex items-start justify-between gap-8">
                                <div>
                                    <n-text class="block">智能语音</n-text>
                                    <n-text depth={3}>[VOX-SIP]</n-text>
                                </div>
                                <common-base-chunk>未开通</common-base-chunk>
                            </div>
                            <n-text depth={2}>
                                特性介绍
                                <n-text depth={3} class="block">
                                    SIP/WebRTC 双向高清回呼
                                </n-text>
                                <n-text depth={3} class="block">
                                    提供测试拨打 100 分钟配额
                                </n-text>
                            </n-text>
                            <div class="flex items-center justify-between gap-8 m-bs-auto">
                                <n-text depth={3}>即时开通</n-text>
                                <common-base-button size="small">免费开通试用</common-base-button>
                            </div>
                        </n-card>
                    </div>
                </n-card>

                <n-card content-class="flex flex-col gap-14">
                    <div class="flex items-center justify-between gap-12 flex-wrap">
                        {heading('企业资产与信用额度', '统一结算中心 · 实时计费与欠费免停机保障')}
                        <div class="flex items-center gap-12">
                            <n-button text type="primary">
                                财务明细
                            </n-button>
                            <n-button text type="primary">
                                授信申请
                            </n-button>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-12 max-[1100px]:grid-cols-1">
                        <n-card size="small" content-class="flex flex-col gap-12">
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>账户可用现金余额</n-text>
                                <common-base-chunk type="success">正常扣费中</common-base-chunk>
                            </div>
                            <n-text class="text-28 font-700">
                                ¥ 45,820.00 <n-text depth={3}>CNY</n-text>
                            </n-text>
                            <n-text depth={3}>支持邮件/短信/通话全业务实时按量抵扣</n-text>
                            <div class="flex gap-8">
                                <common-base-button type="primary">立即充值</common-base-button>
                                <common-base-button>自动扣费管理</common-base-button>
                            </div>
                        </n-card>
                        <n-card size="small" content-class="flex flex-col gap-12">
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>月度授信额度池</n-text>
                                <common-base-chunk type="purple">Enterprise Tier-2</common-base-chunk>
                            </div>
                            <div class="flex items-end justify-between gap-8">
                                <n-text class="text-28 font-700">¥ 200,000.00</n-text>
                                <n-text depth={3}>剩余 ¥ 131,600.00</n-text>
                            </div>
                            <n-progress type="line" percentage={34.2} show-indicator={false} height={6} />
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>已用: ¥ 68,400.00 (34.2%)</n-text>
                                <n-text depth={3}>免息可用: 65.8%</n-text>
                            </div>
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>账单周期: 每月 1 日结算</n-text>
                                <n-button text type="primary">
                                    额度调整
                                </n-button>
                            </div>
                        </n-card>
                        <n-card size="small" content-class="flex flex-col gap-12">
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>欠费防护与安全水位线</n-text>
                                <common-base-chunk type="success">已启用防护</common-base-chunk>
                            </div>
                            <n-text>72 小时免停机保障已激活</n-text>
                            <n-text depth={3}>余额耗尽后仍维持 API 正常分发投递，保障线上业务无中断</n-text>
                            <n-card embedded content-class="flex items-center justify-between gap-8">
                                <n-text depth={3}>预警水位线</n-text>
                                <n-text>&lt; ¥ 5,000 触发短信/邮件告警</n-text>
                            </n-card>
                            <div class="flex gap-8">
                                <common-base-button>告警配置</common-base-button>
                                <common-base-button>发票管理</common-base-button>
                            </div>
                        </n-card>
                    </div>
                </n-card>

                <n-card content-class="flex flex-col gap-14">
                    <div class="flex items-center justify-between gap-12 flex-wrap">
                        {heading('新手快速启动与联调自测中心', '从零到一极速跑通首条通信 · 智能诊断与资质报备协同')}
                        <div class="flex items-center gap-12">
                            <n-button text type="primary">
                                API 文档
                            </n-button>
                            <n-button text type="primary">
                                查看完整接入指南
                            </n-button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-12 max-[1100px]:grid-cols-1">
                        <n-card size="small" content-class="flex flex-col gap-12">
                            <div class="flex items-center justify-between gap-8">
                                <n-text>极速体验 · 首发自测沙箱</n-text>
                                <common-base-chunk type="success">已启用通道</common-base-chunk>
                            </div>
                            <n-card embedded content-class="flex flex-col gap-8">
                                <div class="flex items-center justify-between gap-8">
                                    <n-text>邮件服务联调 (EML-PRO)</n-text>
                                    <common-base-chunk>沙箱环境</common-base-chunk>
                                </div>
                                <n-text depth={3}>接收测试邮箱</n-text>
                                <div class="flex gap-8">
                                    <n-input class="flex-1" value="alex.zhang@example.com" readonly />
                                    <common-base-button type="primary">发送测试邮件</common-base-button>
                                </div>
                                <div class="flex items-center justify-between gap-8">
                                    <n-text type="success">模拟响应: 200 OK</n-text>
                                    <n-text depth={3}>网络耗时: 38ms</n-text>
                                </div>
                            </n-card>
                            <div class="flex items-center justify-between gap-8">
                                <n-text depth={3}>cURL 快速调试命令</n-text>
                                <n-button text type="primary" onClick={copyCurl}>
                                    复制
                                </n-button>
                            </div>
                            <n-log log={curl} rows={4} />
                            <div class="flex items-center justify-between gap-8">
                                <n-button text type="primary">
                                    查看生产环境 API 密钥
                                </n-button>
                                <n-button text type="primary">
                                    API 调试台
                                </n-button>
                            </div>
                        </n-card>
                        <n-card size="small" content-class="flex flex-col gap-12">
                            <div class="flex items-center justify-between gap-8">
                                <n-text>开发者资源与专属服务</n-text>
                                <n-text depth={3}>SDK & 指南</n-text>
                            </div>
                            <n-card embedded content-class="flex flex-col gap-8">
                                <div class="flex items-center justify-between gap-8">
                                    <n-text>官方多语言 SDK 极速安装</n-text>
                                    <common-base-chunk type="success">v2.8 最新</common-base-chunk>
                                </div>
                                <n-radio-group value={lang.value} size="small" onUpdate:value={(value: string) => (lang.value = value)}>
                                    {Object.keys(sdk).map(item => (
                                        <n-radio-button value={item}>{item}</n-radio-button>
                                    ))}
                                </n-radio-group>
                                <n-log log={sdk[lang.value].install} rows={1} />
                                <n-log log={sdk[lang.value].sample} rows={2} />
                            </n-card>
                            <n-card embedded content-class="flex flex-col items-start gap-8">
                                <n-text depth={3}>官方最佳实践与合规规范</n-text>
                                <n-button text type="primary">
                                    全渠道防封号与频控治理指引
                                </n-button>
                                <n-button text type="primary">
                                    高并发批量模版报备格式标准
                                </n-button>
                            </n-card>
                            <n-card embedded content-class="flex items-center justify-between gap-12">
                                <div>
                                    <n-text depth={3} class="block">
                                        专属客户架构师
                                    </n-text>
                                    <n-text type="success">David Chen (在线)</n-text>
                                </div>
                                <div class="text-right">
                                    <n-text depth={3} class="block">
                                        7×24 优先技术联调热线
                                    </n-text>
                                    <n-text>400-880-9988</n-text>
                                </div>
                            </n-card>
                            <div class="flex justify-end gap-8">
                                <common-base-button>技术顾问咨询</common-base-button>
                                <common-base-button type="primary">发起联调协助工单</common-base-button>
                            </div>
                        </n-card>
                    </div>
                </n-card>
            </common-base-element>
        )
    }
})
</script>
