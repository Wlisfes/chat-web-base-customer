<script lang="tsx">
import { defineComponent, computed, nextTick, onBeforeMount, PropType } from 'vue'
import { stop, fetchDelay, fetchHandler } from '@/utils'
import { useVModels } from '@vueuse/core'
import { Settings, Grid } from '@vicons/carbon'
import { useState } from '@/hooks'
import { cloneDeep } from 'lodash-es'

export default defineComponent({
    name: 'CommonDatabaseSearchSettings',
    emits: ['update:faseWhen', 'update:database', '-update:database'],
    props: {
        /**初始化状态**/
        initialize: { type: Boolean, default: false },
        /**弹出层容器样式**/
        className: { type: String, default: '' },
        /**表单边界配置**/
        faseWhen: { type: Object as PropType<Omix>, default: () => ({}) },
        /**列数据**/
        columns: { type: Array as PropType<Array<Omix>>, default: () => [] },
        /**搜索栏字段自定义排版规则**/
        database: { type: Array as PropType<Array<Omix>>, default: () => [] }
    },
    setup(props, { emit }) {
        const { database, faseWhen } = useVModels(props, emit)
        const { state, setState } = useState({ visible: false, checked: true, click: false, columns: [] as Array<Omix> })
        /**原始列顺序**/
        let originalColumns: Array<Omix> = []
        /**是否全选**/
        const checkedAll = computed(() => state.columns.every(item => item.check))
        /**是否半选**/
        const indeterminate = computed(() => {
            return state.columns.every(item => item.check) ? false : state.columns.some(item => item.check)
        })
        /**初始化**/
        onBeforeMount(fetchInitialize)
        async function fetchInitialize() {
            const allColumns = (props.columns ?? []).map(item => ({
                uid: item.uid ?? item.component.uid,
                prop: item.prop ?? item.props.prop,
                label: item.label ?? item.props.label,
                disabled: item.disabled ?? item.props.disabled ?? false,
                check: (item.disabled ?? item.props.disabled) ? true : (item.check ?? item.props.check ?? true)
            }))
            let columns: Array<Omix> = []
            if (database.value.length > 0) {
                /**保留已有排序顺序并合并新字段**/
                const mapped = database.value.map(db => {
                    const col = allColumns.find(c => c.prop === db.prop)
                    return col ? { ...col, check: col.disabled ? true : (db.check ?? col.check) } : null
                })
                const ordered = mapped.filter(Boolean) as Array<Omix>
                const newCols = allColumns.filter(c => !database.value.find(db => db.prop === c.prop))
                columns = [...ordered, ...newCols]
            } else {
                columns = allColumns
            }
            if (originalColumns.length === 0) {
                originalColumns = cloneDeep(columns)
            }
            return await setState({ columns: cloneDeep(columns) }).then(() => {
                return (database.value = state.columns)
            })
        }
        /**全选状态变更**/
        async function fetchUpdate(checked: boolean) {
            return await setState({ checked }).then(async () => {
                const columns = state.columns.map(item => ({ ...item, check: item.disabled ? true : checked }))
                return await setState({ columns }).then(fetchSyncDatabase)
            })
        }
        /**字段状态变更**/
        async function fetchChnage(checked: boolean, node: Omix) {
            return await nextTick(() => (node.check = checked)).then(async () => {
                return await setState({ checked: checkedAll.value }).then(fetchSyncDatabase)
            })
        }
        /**实时同步排版规则到父组件**/
        async function fetchSyncDatabase() {
            return await nextTick(() => (database.value = cloneDeep(state.columns)))
        }
        /**重置排版规则**/
        async function fetchReset() {
            const columns = originalColumns.map(item => ({ ...item, check: true }))
            return await setState({ columns: cloneDeep(columns), checked: true }).then(fetchSyncDatabase)
        }
        /**拖动排序变更后实时生效**/
        async function fetchDragUpdate() {
            return await fetchSyncDatabase()
        }
        /**异步关闭设置组件**/
        async function fetchClickoutside() {
            return await setState({ visible: false, click: true }).then(async () => {
                await nextTick(() => (database.value = cloneDeep(state.columns)))
                return await fetchDelay(0).then(async () => {
                    return await setState({ click: false }).then(() => {
                        return emit('-update:database', database.value)
                    })
                })
            })
        }
        /**开启设置组件**/
        async function fetchState(event: MouseEvent) {
            return await stop(event).then(async () => {
                return await fetchHandler(!state.visible && !state.click, async () => {
                    await fetchInitialize()
                    return await setState({ visible: true, checked: checkedAll.value })
                })
            })
        }

        return () => {
            return (
                <common-base-popover
                    placement="bottom-end"
                    style={{ padding: '0px' }}
                    v-model:visible={state.visible}
                    on-clickoutside={fetchClickoutside}
                >
                    {{
                        trigger: () => (
                            <common-base-button class="min-w-80" icon={Settings} disabled={props.initialize} onClick={fetchState}>
                                设置
                            </common-base-button>
                        ),
                        default: () => (
                            <n-element class="common-database-search-settings flex flex-col overflow-hidden">
                                <div class="flex items-center justify-between p-inline-14 p-block-10">
                                    <n-checkbox
                                        focusable={false}
                                        indeterminate={indeterminate.value}
                                        v-model:checked={state.checked}
                                        on-update:checked={fetchUpdate}
                                    >
                                        全选
                                    </n-checkbox>
                                    <common-base-button text onClick={fetchReset}>
                                        重置
                                    </common-base-button>
                                </div>
                                <n-scrollbar class="max-h-450 overflow-hidden select-none">
                                    <common-base-draggable
                                        class="w-220 flex flex-col p-be-6 overflow-hidden"
                                        handle=".cursor-move"
                                        animation={200}
                                        v-model={state.columns}
                                        onUpdate={fetchDragUpdate}
                                    >
                                        {state.columns.map(item => (
                                            <n-element
                                                key={item.uid}
                                                class="chunk-column flex items-center overflow-hidden p-ie-14 cursor-pointer"
                                            >
                                                <div class="flex p-block-10 p-inline-12 cursor-move">
                                                    <n-icon size={20} color="var(--primary-color)">
                                                        <Grid />
                                                    </n-icon>
                                                </div>
                                                <n-checkbox
                                                    focusable={false}
                                                    disabled={item.disabled}
                                                    v-model:checked={item.check}
                                                    on-update:checked={(c: boolean) => fetchChnage(c, item)}
                                                >
                                                    <div
                                                        title={item.label}
                                                        class="absolute inset-0 overflow-hidden whitespace-nowrap text-ellipsis"
                                                    >
                                                        {item.label}
                                                    </div>
                                                </n-checkbox>
                                            </n-element>
                                        ))}
                                    </common-base-draggable>
                                </n-scrollbar>
                            </n-element>
                        )
                    }}
                </common-base-popover>
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.common-database-search-settings {
    position: relative;
    :deep(.common-base-draggable) > .chunk-column {
        position: relative;
        transition: background-color 0.3s var(--n-bezier);
        &:hover {
            background-color: var(--button-color-2-hover);
        }
        .n-checkbox {
            --n-label-padding: 0px;
            align-items: center;
            display: flex;
            gap: 10px;
            flex: 1;
            .n-checkbox__label {
                position: relative;
                overflow: hidden;
                height: 24px;
                flex: 1;
            }
        }
    }
}
</style>
