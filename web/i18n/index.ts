import { ref, computed } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import { PathValue } from '@/i18n/interface/deep'
import { I18nContext, I18nNode, I18nStore, messages } from '@/i18n/messages'
import { useCoutext, AUTH } from '@/hooks'

export const locale = ref<keyof typeof messages>(getDefaultLocale())
export const i18n = createI18n({
    id: 'APP_NEST_I18N',
    legacy: false,
    globalInjection: true,
    warnHtmlMessage: false,
    silentTranslationWarn: true,
    locale: locale.value,
    messages
})

export type AppLocale = keyof typeof messages

export function isAppLocale(value: unknown): value is AppLocale {
    return value === 'cn' || value === 'en'
}

/**优先使用服务端写进页面的语言，保证水合时和 HTML 一致。**/
export function getDefaultLocale(): AppLocale {
    if (typeof window !== 'undefined' && isAppLocale(window.__INITIAL_LOCALE__)) {
        return window.__INITIAL_LOCALE__
    }
    const { cookies } = useCoutext()
    const value = cookies.get(AUTH.APP_NEST_LOCALE)
    return isAppLocale(value) ? value : 'en'
}

export function applyLocale(value: AppLocale) {
    locale.value = value
    i18n.global.locale.value = value
    return value
}

/**切换语言**/
export async function fetchI18nUpdate(value: AppLocale) {
    const { cookies } = useCoutext()
    await cookies.set(AUTH.APP_NEST_LOCALE, value)
    return applyLocale(value)
}

type I18nSchema = typeof messages.cn & typeof messages.en

export function useI18nContext() {
    const ctx = useI18n()

    /**重载t方法**/
    function t<T extends I18nContext>(path: T, props: Omix = {}): string {
        return ctx.t(path, props)
    }

    /**异步重载t方法**/
    function at<T extends I18nContext>(path: T, props: Omix = {}): () => string {
        return () => ctx.t(path, props)
    }

    /**按路径返回原文案，字符串列表和对象列表都保留各自的结构。**/
    function tm<P extends I18nContext>(path: P): PathValue<I18nSchema, P> {
        return ctx.tm(path) as PathValue<I18nSchema, P>
    }

    /**异步按路径返回原文案。**/
    function atm<P extends I18nContext>(path: P): () => PathValue<I18nSchema, P> {
        return () => ctx.tm(path) as PathValue<I18nSchema, P>
    }

    /**文字转换**/
    function fallback(data: Partial<Record<keyof typeof messages, string | number>>): string | number {
        return data[locale.value] ?? ''
    }

    /**列表查找**/
    function fallStore<T>(column: Array<T>, value: any, opts: Partial<I18nStore<T>> = {}) {
        const key = opts.valueField ?? 'value'
        const node = column.find(item => (item as Omix<I18nNode<T>>)[key] == value)
        if (opts.labelField) {
            return (node ?? opts.defaultValue ?? {})[opts.labelField] as T
        }
        return (node ?? opts.defaultValue) as I18nNode<T>
    }

    return {
        ctx,
        locale,
        Locale: computed(() => messages[locale.value]),
        t,
        at,
        tm,
        atm,
        fallback,
        fallStore
    }
}
