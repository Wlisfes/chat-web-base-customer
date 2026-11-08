import { Request, Response, NextFunction } from 'express'
import https from 'https'

const API_HOST = 'chat-web.lisfes.cn'
const MODULE_PATH = /\.(ts|tsx|mts|cts|vue|js|mjs|cjs|css|scss|json|map|svg)(?:\?|$)/i

/**Vite 源码模块和网关接口都在 /api 下，源码请求不能转发。*/
export function isViteModuleRequest(url: string) {
    return MODULE_PATH.test(url.split('?')[0])
}

/**
 * 开发环境把网关接口原样转发。
 * 必须在 Nest 读取请求体之前挂上，否则 POST 正文被消费后代理会一直等待直到超时。
 */
export function createApiProxy() {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.originalUrl.startsWith('/api') || isViteModuleRequest(request.originalUrl)) {
            next()
            return
        }
        const headers = { ...request.headers, host: API_HOST }
        delete headers.connection
        const proxyRequest = https.request(
            {
                protocol: 'https:',
                hostname: API_HOST,
                method: request.method,
                path: request.originalUrl,
                headers,
                timeout: 30000
            },
            proxyResponse => {
                response.writeHead(proxyResponse.statusCode ?? 502, proxyResponse.headers)
                proxyResponse.pipe(response)
            }
        )
        proxyRequest.on('timeout', () => {
            proxyRequest.destroy()
            if (!response.headersSent) {
                response.status(504).json({ code: 504, message: '网关请求超时' })
            }
        })
        proxyRequest.on('error', () => {
            if (!response.headersSent) {
                response.status(502).end()
            }
        })
        request.pipe(proxyRequest)
    }
}
