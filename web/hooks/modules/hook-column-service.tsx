import { ref, Ref, toRefs, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormInst, DataTableColumn } from 'naive-ui'
import { Observer, fetchExclude, fetchHandler, isNotEmpty } from '@/utils'
import { ResultResolver, ResultColumn } from '@/interface/instance.resolver'
import { fetchNotifyService } from '@/plugins'
import { useGlobal, useStore } from '@/store'
import { cloneDeep, pick } from 'lodash-es'
import { useState } from '@/hooks/modules/hook-state'
import * as Service from '@/api/instance.service'

/**列表缓存对象**/
interface BaseServiceState<T, C> extends Omix {
    /**折叠收缩**/
    when: boolean
    /**边距值**/
    limit: number
    /**控制器**/
    visible: boolean
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**当前页**/
    page: number
    /**当前页数量**/
    size: number
    /**列表总数**/
    total: number
    /**表头数据**/
    columns: Array<Omix<DataTableColumn>>
    /**列表数据**/
    dataSource: Array<T>
    /**被选中的行的对象列表**/
    select: Array<T>
    /**表头配置自定义排版规则**/
    customize: Array<Omix>
    /**搜索栏字段自定义排版规则**/
    database: Array<Omix>
    /**权限标识**/
    actions: Array<Omix<C>>
}
/**列表包装配置（不含列表接口）；不能用 Omit 从 BaseServiceOptions 派生，Omix 的索引签名会让 Omit 后所有字段退化为 any。**/
interface BaseServiceConfig<T, U, R, C> extends Partial<BaseServiceState<T, C>> {
    /**立即执行**/
    immediate?: boolean
    /**刷新列表后保留已选中的数据，用于跨页、搜索后继续勾选；默认 false 刷新即清空**/
    keepSelect?: boolean
    /**额外字段**/
    options?: Omix<R>
    /**筛选条件表单**/
    formState: Omix<U>
    /**列表数据转换函数**/
    transform?: (data: ResultColumn<T>) => Array<Omix> | Promise<Array<Omix>>
    /**回调函数**/
    callback?: (formState: Omix<U>, base: BaseServiceState<T & Omix<R>, C>) => void | any | Promise<any>
}
/**列表包装配置**/
interface BaseServiceOptions<T, U, R, C> extends BaseServiceConfig<T, U, R, C> {
    /**列表接口**/
    request: (base: BaseServiceState<T & Omix<R>, C>, body: Omix<U>, options: Omix) => Promise<ResultResolver<ResultColumn<T>>>
}

/**列表包装hook**/
export function useColumnService<T extends Omix, U extends Omix, R extends Omix, C extends Partial<Omix> = {}>(
    request: BaseServiceOptions<T, U, R, C>['request'],
    options: BaseServiceConfig<T, U, R, C> & { formState: U }
) {
    const route = useRoute()
    const router = useRouter()
    const faseState = ref<Omix>({})
    const formRef = ref<FormInst>() as Ref<FormInst & Omix<{ $el: HTMLFormElement }>>
    const formState = ref<typeof options.formState>(cloneDeep(options.formState))
    const observer = ref(Observer<Record<string, Omix>>())
    const global = useStore(useGlobal) as Omix
    const superAdmin = global.superAdmin ?? { value: false }
    const sheetOptions = global.sheetOptions ?? { value: [] as Array<string> }
    const { state, setState } = useState({
        when: options.when ?? true,
        limit: options.limit ?? 12,
        visible: options.visible ?? false,
        initialize: options.initialize ?? true,
        loading: options.loading ?? true,
        page: options.page ?? 1,
        size: options.size ?? 50,
        total: options.total ?? 0,
        columns: options.columns ?? [],
        dataSource: options.dataSource ?? [],
        select: options.select ?? [],
        customize: options.customize ?? [],
        database: options.database ?? [],
        actions: options.actions ?? [],
        ...(options.options ?? {})
    } as BaseServiceState<T, C> & Omix<R>)

    /**初始化**/
    onMounted(fetchInitialize)
    async function fetchInitialize() {
        return await setState({ visible: true } as never).then(async () => {
            const tasks: Array<any> = []
            if (isNotEmpty(options.keyName)) {
                tasks.push(fetchBaseColumnChunkCustomize(String(options.keyName)))
            }
            if (options.immediate ?? true) {
                tasks.push(fetchRequest())
            }
            return await Promise.all(tasks).then(() => {
                return options.callback?.(formState.value, state as never)
            })
        })
    }

    /**查询字段配置**/
    async function fetchBaseColumnChunkCustomize(keyName: string) {
        try {
            return await Service.httpBaseColumnChunkCustomize({ keyName }).then(async ({ data }) => {
                return await setState({ customize: data.customize ?? [], database: data.database ?? [] } as never)
            })
        } catch (err) {
            return await setState({ customize: [], database: [] } as never)
        }
    }

    /**保存搜索栏字段自定义排版规则**/
    async function fetchUpdateDatabase(items: Array<Omix>) {
        try {
            return await Service.httpBaseUpdateChunkSearch({
                keyName: String(options.keyName),
                fields: items.map(e => ({ check: e.check, prop: e.prop, label: e.label }))
            })
        } catch (err) {
            return await fetchNotifyService({ type: 'error', title: err.message })
        }
    }

    /**保存表头配置自定义排版规则**/
    async function fetchUpdateCustomize(items: Array<Omix>) {
        try {
            return await Service.httpBaseUpdateChunkColumns({
                keyName: String(options.keyName),
                fields: items.map(e => ({ check: e.check, prop: e.key, label: e.title }))
            })
        } catch (err) {
            return await fetchNotifyService({ type: 'error', title: err.message })
        }
    }

    /**修改表单筛选**/
    async function setForm(value: Partial<Omix<typeof options.formState>> = {}): Promise<Omix<typeof options.formState>> {
        return Object.assign(formState.value, value)
    }

    /**重置表单对象数据**/
    async function fetchRestore(data: Omix = {}) {
        const clone = cloneDeep(options.formState ?? {})
        return await setForm(
            Object.keys(options.formState).reduce((node, key: string) => {
                return { ...node, [key]: data[key] ?? clone[key] ?? null }
            }, {})
        )
    }

    /**刷新**/
    async function fetchRefresh(data: Partial<BaseServiceState<T, C> & Omix<R>> = {}, opt: Omix = {}) {
        return await setState(pick(data, ['size', 'page']) as typeof state).then(async () => {
            return await fetchRequest(opt)
        })
    }

    /**列表接口请求回调执行**/
    async function fetchCallbackRequest(opts: Omix = {}) {
        const select = options.keepSelect ? state.select : []
        return await setState({ initialize: false, loading: false, select, ...opts } as never).then(async () => {
            return await fetchHandler(isNotEmpty(options.callback), async () => {
                return await options.callback!(formState.value, state as never)
            }).then(() => state as BaseServiceState<T, C> & Omix<R>)
        })
    }

    /**列表接口请求**/
    async function fetchRequest(opts: Omix = {}) {
        return await setState({ loading: true } as never).then(async () => {
            try {
                const body = fetchExclude<U>(formState.value, pick(state, ['page', 'size']))
                return await request(state as BaseServiceState<T & Omix<R>, C>, body, opts).then(async ({ data }) => {
                    if (options.transform && typeof options.transform === 'function') {
                        data.list = ((await options.transform(data)) ?? []) as Array<Omix<T>>
                    }
                    faseState.value = data ?? {}
                    return await fetchCallbackRequest({ total: data.total ?? 0, dataSource: data.list })
                })
            } catch (err) {
                return await fetchNotifyService({ type: 'error', title: err.message }).then(async () => {
                    faseState.value = {}
                    return await fetchCallbackRequest({ total: 0, dataSource: [] })
                })
            }
        })
    }

    /**通用配置聚合**/
    const instState = computed(() => {
        const keyNames = state.actions.map((item: Omix) => item.key)
        return {
            /**超级管理员**/
            superAdmin: superAdmin.value,
            /**操作列是否显示**/
            showCommand: superAdmin.value || (keyNames.length > 0 && keyNames.some((code: string) => sheetOptions.value.includes(code))),
            /**单选按钮禁用**/
            isSingle: state.select.length !== 1,
            /**多选按钮禁用**/
            isDouble: state.select.length === 0
        }
    })

    /**函数聚合**/
    const instOptions = {
        setState,
        setForm,
        fetchRestore,
        fetchRequest,
        fetchRefresh,
        fetchInitialize,
        fetchUpdateDatabase,
        fetchUpdateCustomize
    }

    return {
        route,
        router,
        state,
        formRef,
        formState,
        faseState,
        observer,
        instState,
        instOptions,
        ...instOptions,
        ...toRefs(state)
    }
}
