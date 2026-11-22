<script lang="tsx">
import { computed, defineComponent, h, type Component } from 'vue'
import { Apps, ChartColumn, Document, Folder, FolderMoveTo, List, SendAlt, Time } from '@vicons/carbon'
import { useRoute, useRouter } from 'vue-router'

function menuIcon(icon: Component) {
    return () => <n-icon size={18}>{h(icon)}</n-icon>
}

/** 短信模块侧栏菜单。 */
export default defineComponent({
    name: 'LayoutCommonSmsSider',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const options = computed(() => [
            { label: '首页概览', key: '/web/sms/home', icon: menuIcon(Apps) },
            { label: '短信应用', key: '/web/sms/app', icon: menuIcon(Folder) },
            { label: '短信模板', key: '/web/sms/template', icon: menuIcon(Document) },
            { label: '号码文件', key: '/web/sms/file', icon: menuIcon(FolderMoveTo) },
            { label: '发送短信', key: '/web/sms/send', icon: menuIcon(SendAlt) },
            { label: '发送任务', key: '/web/sms/task', icon: menuIcon(List) },
            { label: '发送记录', key: '/web/sms/record', icon: menuIcon(Time) },
            { label: '发送统计', key: '/web/sms/stat', icon: menuIcon(ChartColumn) }
        ])

        return () => (
            <div class="layout-common-sms-sider flex flex-col select-none overflow-hidden">
                <n-menu
                    style={{ '--n-item-height': '40px' }}
                    accordion
                    root-indent={14}
                    collapsed-width={64}
                    value={route.path}
                    options={options.value}
                    onUpdate:value={(key: string) => router.push(key)}
                />
            </div>
        )
    }
})
</script>
