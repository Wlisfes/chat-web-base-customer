import { ref, Ref, toRefs, onMounted } from 'vue'
import { FormInst, FormRules, FormItemRule } from 'naive-ui'
import { useState } from '@/hooks/modules/hook-state'
import { isEmpty, fetchHandler, Observer } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { ChunkName } from '@/interface/instance.resolver'

interface FormServiceState extends Omix {
    /**初始化状态**/
    initialize: boolean
    /**加载状态**/
    loading: boolean
    /**禁用状态**/
    disabled: boolean
    /**弹出控制**/
    visible: boolean
}
interface FormServiceOptions<T, R, U, C extends Partial<Record<ChunkName, true>> = {}> extends Partial<FormServiceState> {
    /**表单对象**/
    formState: Omix<T>
    /**表单校验对象**/
    rules?: R
    /**枚举开启配置**/
    chunkNames?: C
    /**初始化完毕执行**/
    immediate?: boolean
    /**额外配置**/
    options?: Omix<U>
    /**回调函数**/
    callback?: Function
}

/**自定义表单Hooks**/
export function useFormService<T extends Omix, R extends FormRules, U extends Omix, C extends Partial<Record<ChunkName, true>> = {}>(
    options: FormServiceOptions<T, R, U, C>
) {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref<FormInst>() as Ref<FormInst & Omix<{ $el: HTMLFormElement }>>
    const observer = ref(Observer<Record<string, Omix>>())
    const formState = ref<typeof options.formState>(options.formState)
    const { state, setState } = useState({
        initialize: options.initialize ?? true,
        disabled: options.disabled ?? false,
        visible: options.visible ?? false,
        loading: options.loading ?? false,
        rules: options.rules ?? {},
        ...(options.options ?? {})
    } as unknown as FormServiceState & NonNullable<typeof options.options>)

    onMounted(async () => {
        return await fetchHandler(Boolean(options.immediate ?? true), async () => {
            return await setState({ visible: true } as never).then(async () => {
                return options.callback?.(formState.value, state)
            })
        })
    })

    async function setForm(data: Partial<T>) {
        return Object.assign(formState.value, data)
    }

    /**重置表单对象数据**/
    function fetchReste(data: Partial<Record<keyof T, any>> & Record<string, any> = {}) {
        const clone = cloneDeep(options.formState ?? {})
        return Object.keys(options.formState).reduce((node, key: string) => {
            return { ...node, [key]: data[key] ?? clone[key] }
        }, {})
    }

    /**重置表单校验结果**/
    function fetchRestore() {
        return new Promise((resolve, reject) => {
            if (!formRef.value) {
                return reject('不存在formRef实例')
            }
            return resolve(formRef.value.restoreValidation())
        })
    }

    /**批量验证表单字段**/
    function fetchRuleCheck(keys: Array<string>, rule: FormItemRule) {
        if (keys.length === 0 || isEmpty(rule.key)) {
            return true
        }
        return keys.includes(rule.key as string)
    }

    /**验证表单**/
    function fetchValidater(keys: Array<string> = []): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!formRef.value) {
                return reject('不存在formRef实例')
            }
            return await setState({ loading: true, disabled: true } as never).then(async () => {
                try {
                    return await formRef.value.validate(
                        errors => (errors ? resolve(errors) : resolve(false)),
                        rule => fetchRuleCheck(keys, rule)
                    )
                } catch (err) {
                    return resolve(false)
                }
            })
        })
    }

    return {
        state,
        route,
        router,
        formRef,
        formState,
        observer,
        ...toRefs(state),
        setState,
        setForm,
        fetchReste,
        fetchRestore,
        fetchValidater
    }
}