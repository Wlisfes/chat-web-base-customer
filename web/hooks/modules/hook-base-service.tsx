import { ref, toRefs, Ref, onMounted } from 'vue'
import { Observer, fetchHandler } from '@/utils'
import { useState } from '@/hooks/modules/hook-state'
import { ResultResolver, ChunkName } from '@/interface/instance.resolver'

interface BaseServiceState extends Omix {
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**错误描述**/
    message: string
}
interface BaseServiceOptions<T, R, C extends Partial<Record<ChunkName, true>> = {}> extends Partial<BaseServiceState> {
    /**立即执行**/
    immediate?: boolean
    /**额外配置**/
    options?: Omix<R>
    /**枚举开启配置**/
    chunkNames?: C
    /**字段转换**/
    transform?: (data: T) => Omix | Promise<Omix>
    /**回调函数**/
    callback?: (data: T, base: BaseServiceState & Omix<R>) => void | any | Promise<any>
    /**请求接口**/
    request: (data: T, base: BaseServiceState & Omix<R>, opt: Omix) => Promise<ResultResolver<T>>
}

/**详情包装hook**/
export function useBaseService<T extends Omix, R extends Omix, C extends Partial<Record<ChunkName, true>> = {}>(
    request: BaseServiceOptions<T, R, C>['request'],
    options: Omit<BaseServiceOptions<T, R, C>, 'request'> = {}
) {
    const faseNode = ref<T>({} as T) as Ref<T>
    const observer = ref(Observer<Record<string, Omix>>())
    const { state: faseState, setState } = useState({
        initialize: options.initialize ?? true,
        loading: options.loading ?? true,
        message: '',
        ...(options.options ?? {})
    } as BaseServiceState & typeof options.options)

    onMounted(async () => {
        return await fetchHandler(Boolean(options.immediate), async () => {
            return await setState({ visible: true } as never).then(async () => {
                const tasks: Array<any> = [fetchRequest()]
                return await Promise.all(tasks).then(() => {
                    return options.callback?.(faseNode.value, faseState as never)
                })
            })
        })
    })

    /**初始化**/
    async function fetchInitialize() {
        return await fetchRequest().then(() => {
            return options.callback?.(faseNode.value, faseState as never)
        })
    }

    /**更新结果对象**/
    async function fetchUpdate(data: T) {
        return (faseNode.value = data)
    }

    /**刷新**/
    async function fetchRefresh(data: Partial<BaseServiceState & typeof options.options> = {}, opt: Omix = {}) {
        return await setState(data).then(async () => {
            return await fetchRequest(opt)
        })
    }

    /**接口请求**/
    async function fetchRequest(opt: Omix = {}) {
        return await setState({ loading: true } as never).then(async () => {
            try {
                const { data } = await request(faseNode.value, faseState as never, opt)
                return await fetchUpdate(data ?? {}).then(async () => {
                    return await setState({ initialize: false, loading: false, message: '' } as never)
                })
            } catch (err) {
                return await fetchUpdate({} as T).then(async () => {
                    return await setState({ initialize: false, loading: false, message: err.message } as never)
                })
            }
        })
    }

    return {
        faseNode,
        faseState,
        observer,
        ...toRefs(faseState),
        setState,
        fetchUpdate,
        fetchInitialize,
        fetchRequest,
        fetchRefresh
    }
}
