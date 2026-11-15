import { createApp, createVNode, render, VNode, CSSProperties } from 'vue'
import { DialogOptions, DialogReactive } from 'naive-ui'
import * as utils from '@/utils'

export interface BaseDialogServiceOtipns {
    /**弹窗类型**/
    type?: 'error' | 'success' | 'warning'
    /**是否可拖拽：必须存在title、showIcon可以使用**/
    draggable?: boolean
    /**头部图标**/
    showIcon?: boolean
    /**点击遮罩层可关闭弹窗**/
    maskClosable?: boolean
    /**取消按钮文案**/
    cancel?: string
    /**确定按钮文案**/
    submit?: string
    /**标题**/
    title?: string | VNode
    /**头部图标**/
    icon?: VNode
    /**标题额外样式**/
    titleClass?: string
    /**内容**/
    content?: string | VNode
    /**内容额外样式**/
    contentClass?: string
    /**关闭弹窗回调事件**/
    onClose?: Function
    /**确定按钮事件**/
    onSubmit?: Function
    /**取消按钮事件**/
    onCancel?: Function
}

/**DOM生成函数**/
export async function fetchDOMRender<T extends Omix<{ style: CSSProperties }>>(
    Component: Parameters<typeof createApp>['0'],
    parameter?: T
) {
    const node = document.createElement('section')
    const component = createVNode(Component, parameter)
    await render(component, node)
    const element = Array.from(node.children).reduce((str: string, el) => (str += el.outerHTML), '')
    return { node, element, component }
}

/**对话弹窗二次封装**/
export async function fetchDialogService(opts: BaseDialogServiceOtipns): Promise<DialogReactive> {
    /**关闭事件异步方法**/
    async function fetchClosePromise() {
        try {
            return await utils.fetchHandler(!!opts.onClose, opts.onClose).then(async function () {
                return true
            })
        } catch (err) {
            return true
        }
    }
    /**取消按钮事件异步方法**/
    async function fetchNegativeClickPromise(event: MouseEvent) {
        try {
            return await utils.fetchHandler(!!opts.onCancel, opts.onCancel).then(async () => {
                return await fetchClosePromise()
            })
        } catch (err) {
            return await fetchClosePromise()
        }
    }
    /**确定按钮回调处理**/
    async function fetchSubmit(vm: DialogReactive, done: Function, data: Omix = {}) {
        if (utils.isNotEmpty(data.loading)) {
            vm.loading = Boolean(data.loading)
        }
        if (utils.isNotEmpty(data.visible) && data.visible === false) {
            await done(true)
            return await fetchClosePromise()
        }
    }
    /**取消按钮事件异步方法**/
    async function fetchPositiveClickPromise(vm: DialogReactive) {
        return new Promise(async resolve => {
            try {
                if (utils.isNotEmpty(opts.onSubmit) && opts.onSubmit) {
                    return await opts.onSubmit((data: Omix) => fetchSubmit(vm, resolve, data))
                } else {
                    await resolve(true)
                    return await fetchClosePromise()
                }
            } catch (err) {
                return await fetchClosePromise()
            }
        })
    }

    const vm = window.$dialog.create({
        autoFocus: false,
        type: 'warning',
        draggable: opts.draggable ?? true,
        showIcon: utils.isNotEmpty(opts.title) ? opts.showIcon ?? true : false,
        maskClosable: opts.maskClosable ?? false,
        negativeButtonProps: { size: 'medium', ghost: false, secondary: true, style: { '--n-height': '32px', 'min-width': '68px' } },
        positiveButtonProps: { size: 'medium', type: 'primary', style: { '--n-height': '32px', 'min-width': '68px' } },
        positiveText: opts.cancel ?? '确定',
        negativeText: opts.submit ?? '取消',
        titleClass: `text-18 line-height-28 gap-8 select-none ${opts.titleClass ?? ''}`,
        contentClass: `line-height-24 select-none ${opts.contentClass ?? ''}`,
        class: 'flex flex-col',
        style: {
            '--n-font-size': '15px',
            '--n-padding': '20px',
            '--n-close-margin': '16px 16px 0 0',
            '--n-icon-margin': '0',
            '--n-content-margin': utils.isNotEmpty(opts.title) ? '12px 0 16px' : '0px 28px 32px 0'
        },
        title: function () {
            return utils.isEmpty(opts.title) ? undefined : opts.title
        },
        content: function () {
            return utils.isEmpty(opts.content) ? undefined : opts.content
        },
        icon: function () {
            return opts.icon ? (
                opts.icon
            ) : (
                <n-text class="flex items-center" type={opts.type ?? 'warning'}>
                    <common-base-icon size={28} name="nest-state-warning"></common-base-icon>
                </n-text>
            )
        },
        /**Esc按钮关闭回调事件**/
        onEsc: fetchClosePromise,
        /**关闭icon事件**/
        onClose: fetchClosePromise,
        /**取消按钮事件**/
        onNegativeClick: fetchNegativeClickPromise,
        /**确定按钮事件**/
        onPositiveClick: (event: MouseEvent) => fetchPositiveClickPromise(vm)
    } as DialogOptions)
    return vm
}
