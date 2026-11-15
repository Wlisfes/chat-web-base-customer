import { toRefs } from 'vue'
import { isNotEmpty } from 'class-validator'
import { useState } from '@/hooks/modules/hook-state'
import { cloneDeep, isArray, isObject } from '@/utils'
import { ResultResolver } from '@/interface/instance.resolver'
interface BaseServiceState {
    /**搜索关键字**/
    keywords: string
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**全量列表数据**/
    dataSource: Array<Omix>
}
/**hooks基本配置**/
interface BaseServiceOptions<T, U> extends Partial<BaseServiceState> {
    /**立即执行**/
    immediate?: boolean
    /**额外数据**/
    options?: Omix<U>
    /**请求接口**/
    request: (state: BaseServiceState) => Promise<ResultResolver<Array<Omix>>>
    /**数据转换**/
    transform?: (data: Array<Omix<T>>) => Array<Omix> | Promise<Array<Omix>>
    /**初始化回调事件**/
    callback?: (data: BaseServiceState) => void | any | Promise<any>
}

/**下拉通用查询接口hook**/
export function useSelectService<T extends Omix, U extends Omix>(
    request: BaseServiceOptions<T, U>['request'],
    options: Omit<BaseServiceOptions<T, U>, 'request'> = {}
) {
    const { state, setState } = useState({
        keywords: options.keywords ?? '',
        loading: options.loading ?? true,
        initialize: options.initialize ?? true,
        dataSource: [] as Array<Omix>,
        ...(options.options ?? {})
    } as BaseServiceState & typeof options.options)

    if (options.immediate) {
        fetchRequest()
    }

    /**远程搜索下拉**/
    async function fetchRemote(keywords: string) {
        return await setState({ keywords: keywords ?? '' } as never).then(async () => {
            if (isNotEmpty(keywords)) {
                return await fetchRequest()
            } else {
                return await setState({ dataSource: [] } as never)
            }
        })
    }

    /**数据转换**/
    async function fetchTransform(data: Array<Omix>): Promise<Array<Omix<T>>> {
        if (options.transform) {
            const cloneData = cloneDeep(data) as Array<Omix<T>>
            return (await options.transform(cloneData)) as Array<Omix<T>>
        }
        return data as Array<Omix<T>>
    }

    async function fetchRequest() {
        return await setState({ loading: true } as never).then(async () => {
            try {
                const list = await request(state).then(({ data }) => {
                    if (data && isArray(data)) {
                        return fetchTransform(data ?? [])
                    } else if (isObject(data)) {
                        return fetchTransform((data as Omix).list ?? [])
                    }
                    return fetchTransform([])
                })
                return await setState({ loading: false, initialize: false, dataSource: list } as never).then(() => {
                    options.callback?.(state)
                    return state
                })
            } catch (err) {
                return await setState({ loading: false, initialize: false, dataSource: [] } as never).then(() => {
                    options.callback?.(state)
                    return state
                })
            }
        })
    }

    return {
        state,
        ...toRefs(state),
        setState,
        fetchRemote,
        fetchRequest
    }
}
