export const homeCn = {
    choose: {
        hot: 'WHY CHOOSE CHATBOOK',
        title: 'ChatBook SMS 的技术实力与服务保障',
        document: '致力于使用优质的群发 SMS 解决方案，将您的营销与交易内容高质、合规、稳定地送达目标受众设备。',
        columns: [
            {
                title: '超广覆盖 · 自由联通',
                document: `ChatBook SMS 支持全球 190 多个国家/地区的 800 多个电信网络运营商。支持跨国漫游号码与本地专属 SenderID，便于出海企业简单、安全、稳定地与全球用户实现无障碍即时通讯连接。`
            },
            {
                title: '行业覆盖全面 · 灵活策略支持',
                document: `我们致力于创新通信解决方案，让 SMS 消息自由传递，满足短信营销与验证需求。支持互联网、跨境电商、泛娱乐、游戏、外汇投顾、教育等多场景大批量发送，并提供专属合规通道与模板优化指导。`
            },
            {
                title: '优质通道 · 高效并发',
                document: `自研分布式通信集群，高并发响应与海量数据吞吐。高峰活动时千万级短信无堆积迅速送达，安全稳定，秒级触达，实际到达率领先业界。`
            },
            {
                title: '独立后台 · 实时透视与回执',
                document: `通过 ChatBook SMS 可视化后台轻松批量群发。每一条信息可查询送达成功、接收失败及退订状态，全业务提供多维度可视化图表。`
            }
        ]
    },
    issues: {
        hot: 'FAQS',
        title: '关于 SMS 的常见问题',
        document: `ChatBook SMS 的目标是让您轻松开始使用群发短信，并充分利用它的诸多优势。无论您是新手还是经验丰富的用户，都能找到功能、定价等常见问题的答案。`,
        support: '前往支持中心',
        contact: '联系我们',
        columns: [
            {
                title: '可以发送哪些内容，限制行业吗？',
                document: `ChatBook SMS 支持电商推广、通知、验证码、游戏、海外社交、投资资讯、借贷账单提醒等多种类型。涵盖行业广泛，拥有丰富的海外合规报备经验。`
            },
            {
                title: '三网（移动、联通和电信）都可以发吗？',
                document: `三网全网段均支持，包含全国常规号段与携号转网号库。同时支持中国大陆、中国港澳台、东南亚等全球 190 多个国家/地区的直连网络下发。`
            },
            {
                title: '如何通过 ChatBook SMS 发送短信？',
                document: `平台提供两种发送模式：一是通过 Web 独立后台进行号码批量上传与模板群发；二是使用 RESTful API 接入系统实现自动化触发，上手仅需 3 分钟。`
            },
            {
                title: '批量发送短信如何计费？',
                document: `ChatBook SMS 零月租、零通道开通费。通道价格公开透明，根据采购发送量享受自动阶梯优惠，按实际送达成功计费，保障透明对账。`
            },
            {
                title: '数据在后台是否绝对安全？',
                document: `银行级数据加密、256 位密钥证书与 HTTPS 全程传输。访问权限隔离、号码脱敏与自研监控系统，全方位阻断数据泄漏隐患。`
            },
            {
                title: '遇到问题你们提供哪些方面的技术支持？',
                document: `专属客户经理与通信技术顾问提供 7×24 小时双轨支持，包含模板审核建议、送达率调优、海外运营商合规咨询及紧急通道切换保障。`
            }
        ]
    },
    signal: {
        kicker: 'SIGNAL MESH · 全球通信专网',
        title: '一条链路，把发送、智能路由和回执收在同一张网',
        document: '自研动态权重调度算法，毫秒级感知海外各运营商基站拥塞状态，保障高并发高峰期不卡单、不漏发。',
        metrics: [
            {
                value: '190+',
                label: '国家及地区覆盖',
                hint: 'Global Coverage',
                document: '无需对接当地实体，一套凭证轻松下发至东南亚、中东、欧美及拉美。'
            },
            {
                value: '800+',
                label: '顶级运营商直连通道',
                hint: 'Direct Telco',
                document: '包括 Vodafone、Singtel、Telefonica、中国移动、SoftBank 等一级网关。'
            },
            {
                value: '< 1s',
                label: '全球路由触达响应',
                hint: 'Routing Latency',
                document: '边缘计算节点就近路由下发，90% 短信在 3 秒内送达最终终端并完成回执。'
            },
            {
                value: '99.99%',
                label: '企业级高可用服务保障',
                hint: 'Availability SLA',
                document: '多活灾备集群，单机房故障毫秒级无感降级容灾，杜绝突发业务中断。'
            }
        ],
        steps: [
            { index: '01', title: '接入', document: '后台或 API 提交任务，模板、号码和发送窗口一次配置。' },
            { index: '02', title: '路由', document: '按国家、运营商和内容策略选择通道，异常时自动分流。' },
            { index: '03', title: '发送', document: '分布式节点并发下发，验证码、通知和营销短信分开排队。' },
            { index: '04', title: '回执', document: '到达、失败和退订实时回传，报表按任务、通道和国家拆开。' }
        ],
        chips: ['HTTP API', '独立后台', '国际短信', '三网发送', '实时回执', '可视化报表', '权限隔离', '通道监控']
    },
    facts: {
        hot: 'LIVE ROUTING ACTIVE',
        title: 'ChatBook 创新全渠道通信解决方案，让 SMS 消息在全球自由无阻传递',
        columns: [
            { title: '15,208,490', document: '今日发送总量，全球每秒吞吐量 8,420 条' },
            { title: '95.4%', document: '3 分钟阅读率，短信达设备后即时打开' },
            { title: '99.1%', document: '端到端送达率，电信级直连多路兜底' },
            { title: '0.82 秒', document: '平均交付时延，亚太、欧洲及美洲专线' }
        ],
        brand: 'ChatBook',
        sloganBefore: '为出海企业及高并发业务打造的电信级短信路由枢纽。',
        sloganAfter: '验证码、实时通知、营销推送及双向互动，秒级触发，全链路透明可追溯。',
        action: '立即开通免费测试'
    },
    site: {
        nav: {
            product: '产品服务',
            solutions: '解决方案',
            coverage: '资费覆盖',
            support: '网络与通道',
            about: '常见问题'
        },
        subscribe: {
            title: '订阅 ChatBook SMS 产品动态与行业洞察',
            document: '加入超过 20,000 名出海开发者与市场总监的行列，获取最新通道资费变动、合规政策与技术文档更新。',
            placeholder: '输入您的工作邮箱',
            action: '订阅'
        },
        brand: {
            title: 'ChatBook',
            document: `我们致力于创新通信解决方案，让 SMS 消息自由传递，满足所有短信营销与验证需求。您可以毫不费力地发送一次性验证码、通知、时事通讯、提醒和营销短信。`
        },
        solutions: {
            title: '产品 & 解决方案',
            columns: [
                { link: '/', name: '国内短信服务' },
                { link: '/', name: '国际 SMS 群发' },
                { link: '/', name: '五类合规短信' },
                { link: '/', name: '卡发短信网关' },
                { link: '/', name: '覆盖范围 & 资费表' },
                { link: '/', name: '使用与接入流程' },
                { link: '/', name: '常见问题解答' },
                { link: '/', name: 'RESTful API 文档' }
            ]
        },
        about: {
            title: '关于与支持',
            columns: [
                { link: '/', name: '公司简介' },
                { link: '/', name: '联系我们' },
                { link: '/', name: '隐私政策与条款' },
                { link: '/', name: '动态与产品公告' }
            ]
        }
    }
}

export const homeEn = {
    choose: {
        hot: 'WHY CHOOSE CHATBOOK',
        title: 'Technical strength and service assurance of ChatBook SMS',
        document: `A high-quality bulk SMS network that delivers marketing and transactional content reliably, compliantly, and steadily.`,
        columns: [
            {
                title: 'Wide coverage, open connectivity',
                document: `ChatBook SMS reaches more than 800 carrier networks in over 190 countries and regions, with roaming numbers and local Sender IDs for a simple, secure connection to users worldwide.`
            },
            {
                title: 'Broad industry coverage, flexible policy',
                document: `Messaging that moves freely for marketing and verification, across internet, cross-border commerce, entertainment, gaming, advisory, and education, with dedicated compliant routes.`
            },
            {
                title: 'Quality routes, high concurrency',
                document: `A distributed cluster handles peak traffic without backlog. Delivery stays stable, reaches devices in seconds, and leads the industry on arrival rate.`
            },
            {
                title: 'Dedicated console, live receipts',
                document: `Send in bulk from a visual console. Every message can be traced for delivery, failure, and opt-out, with multi-dimensional charts.`
            }
        ]
    },
    issues: {
        hot: 'FAQS',
        title: 'Common questions about SMS',
        document: `ChatBook SMS is built to help you start bulk messaging quickly and use it well. Whether you are new or already sending at scale, you can find answers on features, pricing, and everyday use.`,
        support: 'Go to support',
        contact: 'Contact us',
        columns: [
            {
                title: 'What can I send, and are industries restricted?',
                document: `ChatBook SMS supports promotions, notifications, verification codes, gaming, overseas social, investment updates, and billing reminders, with extensive overseas compliance experience.`
            },
            {
                title: 'Can I send to China Mobile, China Unicom, and China Telecom?',
                document: `All three networks are supported, including regular number ranges and number-portability data. Direct routes also cover mainland China, Hong Kong, Macao, Taiwan, Southeast Asia, and 190+ countries and regions.`
            },
            {
                title: 'How do I send SMS with ChatBook SMS?',
                document: `Two modes: upload numbers and send templates from the web console, or trigger messages through the RESTful API. Setup takes about three minutes.`
            },
            {
                title: 'How is bulk SMS billed?',
                document: `No monthly rent and no route setup fee. Prices are public, volume discounts apply automatically, and you pay only for messages that are delivered.`
            },
            {
                title: 'Is data absolutely safe in the console?',
                document: `Bank-grade encryption, 256-bit certificates, and HTTPS protect the path. Access isolation, number masking, and in-house monitoring block data leaks.`
            },
            {
                title: 'What technical support do you provide?',
                document: `A dedicated manager and messaging advisor provide 7x24 support, including template review, delivery tuning, overseas compliance advice, and emergency route switching.`
            }
        ]
    },
    signal: {
        kicker: 'SIGNAL MESH · Global network',
        title: 'One link that keeps sending, smart routing, and receipts on the same network',
        document: `Dynamic weight scheduling senses overseas carrier congestion in milliseconds, so peak traffic does not stall or drop.`,
        metrics: [
            {
                value: '190+',
                label: 'Countries and regions',
                hint: 'Global Coverage',
                document: 'One credential reaches Southeast Asia, the Middle East, Europe, the Americas, and Latin America.'
            },
            {
                value: '800+',
                label: 'Direct carrier routes',
                hint: 'Direct Telco',
                document: 'Tier-1 gateways including Vodafone, Singtel, Telefonica, China Mobile, and SoftBank.'
            },
            {
                value: '< 1s',
                label: 'Global routing response',
                hint: 'Routing Latency',
                document: 'Edge nodes route nearby. 90% of messages reach the handset and return a receipt within 3 seconds.'
            },
            {
                value: '99.99%',
                label: 'Enterprise availability',
                hint: 'Availability SLA',
                document: 'Active-active clusters fail over in milliseconds, so a single site outage does not stop traffic.'
            }
        ],
        steps: [
            {
                index: '01',
                title: 'Connect',
                document: 'Submit a job from the console or API. Configure the template, numbers, and send window once.'
            },
            {
                index: '02',
                title: 'Route',
                document: 'Pick a route by country, carrier, and content policy. Traffic shifts automatically when a route fails.'
            },
            {
                index: '03',
                title: 'Send',
                document: 'Distributed nodes send in parallel. Verification, notification, and marketing messages stay in separate queues.'
            },
            {
                index: '04',
                title: 'Receipt',
                document: 'Delivered, failed, and opt-out results come back live. Reports split by job, route, and country.'
            }
        ],
        chips: [
            'HTTP API',
            'Independent console',
            'International SMS',
            'Three-network delivery',
            'Live receipts',
            'Visual reports',
            'Isolated permissions',
            'Route monitoring'
        ]
    },
    facts: {
        hot: 'LIVE ROUTING ACTIVE',
        title: 'ChatBook An omnichannel messaging solution that lets SMS move freely worldwide',
        columns: [
            { title: '15,208,490', document: 'Sent today, with 8,420 messages per second worldwide' },
            { title: '95.4%', document: 'Read within three minutes of reaching the device' },
            { title: '99.1%', document: 'End-to-end delivery, with direct carrier fallback' },
            { title: '0.82s', document: 'Average delivery delay across Asia Pacific, Europe, and the Americas' }
        ],
        brand: 'ChatBook',
        sloganBefore: 'A carrier-grade SMS hub for outbound and high-concurrency businesses.',
        sloganAfter: 'Verification, live notices, campaigns, and two-way messaging, triggered in seconds and traceable end to end.',
        action: 'Start a free test'
    },
    site: {
        nav: {
            product: 'Products',
            solutions: 'Solutions',
            coverage: 'Pricing & coverage',
            support: 'Network & routes',
            about: 'FAQs'
        },
        subscribe: {
            title: 'Subscribe to ChatBook SMS product news',
            document: 'Join 20,000+ outbound developers and marketers for route pricing, compliance updates, and docs.',
            placeholder: 'Work email',
            action: 'Subscribe'
        },
        brand: {
            title: 'ChatBook',
            document: `We build messaging solutions that let SMS move freely for marketing and verification. Send one-time passwords, notifications, newsletters, reminders, and campaigns without the extra work.`
        },
        solutions: {
            title: 'Products & Solutions',
            columns: [
                { link: '/', name: 'Domestic SMS' },
                { link: '/', name: 'International SMS' },
                { link: '/', name: 'Compliant category SMS' },
                { link: '/', name: 'SIM-card SMS gateway' },
                { link: '/', name: 'Coverage & pricing' },
                { link: '/', name: 'How to connect' },
                { link: '/', name: 'FAQs' },
                { link: '/', name: 'RESTful API docs' }
            ]
        },
        about: {
            title: 'About & support',
            columns: [
                { link: '/', name: 'Company' },
                { link: '/', name: 'Contact' },
                { link: '/', name: 'Privacy & terms' },
                { link: '/', name: 'Product news' }
            ]
        }
    }
}
