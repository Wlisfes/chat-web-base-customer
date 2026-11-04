import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { fetchGlobalEnv } from '@server/utils'
import { AppModule } from '@web-client-ssr-server/app.module'

async function bootstrap() {
    fetchGlobalEnv()
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true })
    const port = process.env.NODE_WEB_CLIENT_SSR_PORT || 5480
    await app.listen(port)
    console.log(`客户门户 SSR [${process.env.NODE_ENV}]: http://localhost:${port}`)
}

bootstrap()