/**通用对象**/
declare type Omix<T = Record<string, any>> = T & Record<string, any>

declare interface Window {
    __INITIAL_DATA__?: Omix
}

declare interface EnvOptions {
    NODE_ENV: 'development' | 'production'
    NODE_WEB_CLIENT_SSR_PORT: number
    /**页面请求现有网关，不由本项目的 Nest 提供接口**/
    NODE_WEB_API_BASEURL: string
    NODE_WEB_SEO_TITLE: string
    NODE_WEB_SEO_SUBTITLE: string
    NODE_WEB_SEO_KEYWORDS: string
    NODE_WEB_SEO_DESCRIPTION: string
}

interface ImportMetaEnv extends EnvOptions {}

declare namespace NodeJS {
    interface ProcessEnv extends EnvOptions {}
}