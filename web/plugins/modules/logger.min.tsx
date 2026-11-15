export interface PageLogger {
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
    scope: (name: string) => PageLogger
}

const JSON_TOKEN_PATTERN = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

function formatTimestamp(date: Date) {
    const pad = (value: number, length = 2) => String(value).padStart(length, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

function colorText(color: string, value: string) {
    const codes: Record<string, string> = {
        cyan: '96',
        green: '92',
        yellow: '93',
        red: '91',
        magenta: '95',
        gray: '90'
    }
    return `\u001B[${codes[color]}m${value}\u001B[39m`
}

function colorHex(color: string, value: string) {
    const channels = color.match(/[\da-fA-F]{2}/g)?.map(channel => Number.parseInt(channel, 16))
    if (!channels || channels.length < 3 || channels.some(channel => Number.isNaN(channel))) return value
    const [red, green, blue] = channels
    return `\u001B[38;2;${red};${green};${blue}m${value}\u001B[39m`
}

function colorJson(json: string) {
    return json.replace(JSON_TOKEN_PATTERN, (token, quoted: string | undefined, colon: string | undefined) => {
        if (quoted && colon) return `${colorText('cyan', quoted)}${colon}`
        if (quoted) return colorText('green', quoted)
        if (token === 'null') return colorText('gray', token)
        if (token === 'true' || token === 'false') return colorText('magenta', token)
        return colorText('yellow', token)
    })
}

function formatLogValue(value: unknown) {
    if (typeof value === 'string') return value
    if (value instanceof Error) return value.stack || value.message
    try {
        return '\n' + colorJson(JSON.stringify(value, null, 4))
    } catch {
        return String(value)
    }
}

function createLogId() {
    return globalThis.crypto.randomUUID()
}

export function createPageLogger(scope?: string, path?: string): PageLogger {
    const write = (level: 'INFO' | 'WARN' | 'ERROR', args: unknown[]) => {
        const header = [
            colorText('green', `组件名称:[${scope || 'page'}]`),
            // colorText('cyan', `路由:[${path || '-'}]`),
            colorHex('#fb9300', formatTimestamp(new Date())),
            colorText(level === 'ERROR' ? 'red' : level === 'WARN' ? 'yellow' : 'green', level),
            colorHex('#536dfe', `日志ID:[${createLogId()}]`)
        ].join('  ')
        const line = `${header}${args.map(formatLogValue).join(' ')}`
        console[level === 'INFO' ? 'info' : level === 'WARN' ? 'warn' : 'error'](line)
    }
    return {
        info: (...args) => write('INFO', args),
        warn: (...args) => write('WARN', args),
        error: (...args) => write('ERROR', args),
        scope: name => createPageLogger(name, path)
    }
}

/**__file 由 vueFilePlugin 写入，生产构建保留相对路径。**/
export function resolvePageLabel(component: { name?: string; __name?: string; __file?: string } | null | undefined) {
    const file = component?.__file?.replace(/\\/g, '/')
    const index = file?.lastIndexOf('views/') ?? -1
    if (file && index >= 0) {
        return file.slice(index)
    }
    return file || component?.name || component?.__name || 'page'
}
