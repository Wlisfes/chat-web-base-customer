import { zhCN, enUS, dateZhCN, dateEnUS } from 'naive-ui'
import { Path } from '@/i18n/interface/deep'
import { homeCn, homeEn } from '@/i18n/modules/home'

export const messages = {
    cn: {
        i18nDate: dateZhCN,
        ...zhCN,
        home: homeCn
    },
    en: {
        i18nDate: dateEnUS,
        ...enUS,
        home: homeEn
    }
}
export default messages
export type I18nContext = Path<typeof messages.cn & typeof messages.en>
export type I18nNode<T> = Omix<T & { label: string; value: number | string }>
export type I18nStore<T = any> = Omix<{ defaultValue: T; labelField: string; valueField: string }>
