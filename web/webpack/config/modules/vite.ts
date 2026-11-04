import { resolve } from 'path'
import dotenv from 'dotenv'

/**只把 NODE_WEB_ 前缀注入到 import.meta.env，避免把进程环境全部打进前端包。**/
export function fetchEnvService(mode: string) {
    const config = dotenv.config({ path: resolve(process.cwd(), `env/.env.${mode}`) }).parsed ?? {}
    const defined: Record<string, string> = {}
    Object.entries(config).forEach(([key, value]) => {
        if (key.startsWith('NODE_WEB_')) {
            defined[`import.meta.env.${key}`] = JSON.stringify(value)
        }
    })
    return defined
}