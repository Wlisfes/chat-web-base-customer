<script lang="tsx">
import { defineComponent, PropType } from 'vue'
import { isNotEmpty } from '@/utils'

export default defineComponent({
    name: 'CommonBaseUser',
    props: {
        /**前缀**/
        prefix: { type: String, default: '' },
        /**渲染类型**/
        element: { type: String as PropType<'avatar' | 'text'>, default: 'text' },
        /**数据对象**/
        data: { type: Object as PropType<Omix>, default: () => ({}) }
    },
    setup(props) {
        return () => {
            if (['text'].includes(props.element)) {
                if (isNotEmpty(props.data?.name) && isNotEmpty(props.data?.number)) {
                    return <span>{`${props.prefix}${props.data.name} ${props.data.number}`}</span>
                } else if (isNotEmpty(props.data?.name) && props.data?.uid == 0) {
                    return <span>{props.data.name}</span>
                }
            } else if (['avatar'].includes(props.element) && isNotEmpty(props.data?.avatar)) {
                return (
                    <div class="flex items-center justify-center">
                        <n-image class="b-rd-2 h-32 w-32" object-fit="cover" width="32" src={props.data.avatar} />
                    </div>
                )
            }
            return <span>-</span>
        }
    }
})
</script>
