import { relative } from 'path'
import type { Plugin } from 'vite'

/**生产构建默认不挂 __file。写进组件导出，避免打包时被摇掉。**/
export function vueFilePlugin(): Plugin {
    let root = ''
    return {
        name: 'vue-file',
        enforce: 'post',
        configResolved(config) {
            root = config.root
        },
        transform(code, id) {
            const filename = id.split('?')[0]
            if (!filename.endsWith('.vue') || id.includes('type=') || !code.includes('_sfc_main')) return
            const file = JSON.stringify(relative(root, filename).replace(/\\/g, '/'))
            const exported = code.replace(
                /export default \/\*#__PURE__\*\/_export_sfc\(_sfc_main, \[([\s\S]*?)\]\)/,
                (_, props: string) =>
                    `export default /*#__PURE__*/_export_sfc(_sfc_main, [${props}${props.trim() ? ', ' : ''}['__file', ${file}]])`
            )
            if (exported !== code) return exported
            const plain = code.replace(
                /export default _sfc_main\b/,
                `export default ((_sfc_main.__vccOpts || _sfc_main).__file = ${file}, _sfc_main)`
            )
            if (plain !== code) return plain
            return `${code}\n;(_sfc_main.__vccOpts || _sfc_main).__file = ${file}\n`
        }
    }
}
