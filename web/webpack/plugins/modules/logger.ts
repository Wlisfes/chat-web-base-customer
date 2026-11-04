export interface PageLogger {
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
}

export function createPageLogger(scope = 'web-client'): PageLogger {
    return {
        info: (...args) => console.info(`[${scope}]`, ...args),
        warn: (...args) => console.warn(`[${scope}]`, ...args),
        error: (...args) => console.error(`[${scope}]`, ...args)
    }
}