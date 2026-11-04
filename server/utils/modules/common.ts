import { resolve } from 'path'
import dotenv from 'dotenv'

/**按 NODE_ENV 读取 env/.env.<env>，不覆盖已经存在的进程变量。**/
export function fetchGlobalEnv<T = NodeJS.ProcessEnv>(): T {
    const nodeEnv = process.env.NODE_ENV || 'development'
    dotenv.config({ path: resolve(process.cwd(), `env/.env.${nodeEnv}`) })
    return process.env as T
}