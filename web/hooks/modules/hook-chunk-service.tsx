import { ref } from 'vue'
import { useState } from '@/hooks/modules/hook-state'
import { isEmpty, isNotEmpty, Observer } from '@/utils'
import { ResultResolver, ChunkOptionGroup } from '@/interface/instance.resolver'

/**字典枚举基础状态**/
export interface ChunkBaseState<K extends string> {
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**枚举类型**/
    types: Array<K>
    /**tab默认值**/
    tabName: string
}

/**字典枚举对象：types 中的每个枚举类型都会扩展为 state 上的同名字段**/
export type ChunkState<K extends string> = ChunkBaseState<K> & Record<K, ChunkOptionGroup>

/**枚举下拉通用hooks配置**/
export interface ChunkServiceOptions<K extends string> {
    /**立即执行**/
    immediate?: boolean
    /**初始化状态**/
    initialize?: boolean
    /**加载状态**/
    loading?: boolean
    /**枚举类型**/
    types?: Array<K>
    /**tab默认值**/
    tabName?: string
    /**字典请求函数**/
    request?: (data: ChunkState<NoInfer<K>>) => Promise<ResultResolver<Omix>>
}

/**枚举下拉通用hooks**/
export function useChunkService<const K extends string = never>(
    request: (data: ChunkState<NoInfer<K>>) => Promise<ResultResolver<Omix>>,
    options: ChunkServiceOptions<K> = {}
) {
    const chunkOptions = ref<Omix>({})
    const observer = Observer<Record<string, Omix>>()
    const { state, setState } = useState<ChunkBaseState<K>>({
        types: options.types ?? [],
        tabName: options.tabName ?? 'default',
        loading: options.loading ?? options.immediate ?? true,
        initialize: options.initialize ?? options.immediate ?? true,
        ...(options.types ?? []).reduce((s, key) => ({ ...s, [key]: [] }), {})
    })

    if (options.immediate ?? true) {
        fetchChunkService()
    }

    /**更新结果对象**/
    async function fetchUpdate(data: Omix) {
        return (chunkOptions.value = data)
    }

    async function fetchChunkService(): Promise<ChunkState<K>> {
        return (await setState({ loading: true }).then(async () => {
            try {
                if (isEmpty(options.request)) {
                    return await request(state as ChunkState<NoInfer<K>>).then(async ({ data }) => {
                        return await fetchUpdate(data ?? {}).then(async () => {
                            return await setState(Object.assign(data ?? {}, { initialize: false, loading: false }))
                        })
                    })
                } else if (isNotEmpty(options.request) && options.request) {
                    const taskNames = [request(state as ChunkState<NoInfer<K>>), options.request(state as ChunkState<NoInfer<K>>)]
                    return await Promise.all(taskNames).then(async ([response, { data }]) => {
                        return await fetchUpdate(response.data ?? {}).then(async () => {
                            return await setState(Object.assign(data ?? {}, { initialize: false, loading: false }))
                        })
                    })
                }
                return await setState({ loading: false, initialize: false })
            } catch (err) {
                return await setState({ loading: false, initialize: false })
            }
        })) as ChunkState<K>
    }

    return {
        observer,
        chunkState: state as ChunkState<K>,
        chunkOptions,
        setState,
        fetchChunkService,
        fetchCommonService: fetchChunkService
    }
}
