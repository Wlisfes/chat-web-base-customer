<script lang="tsx">
import { defineComponent, PropType, VNode } from 'vue'

export default defineComponent({
    name: 'CommonBaseHeader',
    props: {
        /**页面标题**/
        title: { type: [String, Object] as PropType<string | VNode>, Required: true },
        /**副标题说明**/
        document: { type: [String, Object] as PropType<string | VNode> }
    },
    setup(props, { slots }) {
        return () => (
            <common-base-element class="common-base-header flex items-center overflow-hidden">
                <div class="flex flex-col overflow-hidden">
                    <n-h1 class="text-28 line-height-34 m-0">{props.title}</n-h1>
                    {props.document && (
                        <n-p depth={3} class="text-14 line-height-24 m-0 p-bs-5">
                            {props.document}
                        </n-p>
                    )}
                </div>
                {slots.default && slots.default()}
            </common-base-element>
        )
    }
})
</script>
