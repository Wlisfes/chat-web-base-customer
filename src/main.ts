import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { createApiProxy, fetchGlobalEnv } from '@server/utils'
import { AppModule } from './app.module'

async function bootstrap() {
    fetchGlobalEnv()
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true })
    if (process.env.NODE_ENV !== 'production') {
        // 开发环境先挂网关代理，避免正文被提前消费，同时放行 /api 下的 Vite 源码。
        app.use(createApiProxy())
    }
    const port = process.env.NODE_WEB_CLIENT_SSR_PORT || 5480
    await app.listen(port)
    console.log(`客户门户 SSR [${process.env.NODE_ENV}]: http://localhost:${port}`)
}

bootstrap()
