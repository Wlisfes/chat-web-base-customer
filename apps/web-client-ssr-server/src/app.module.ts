import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@server/modules/config/config.module'
import { AppController } from '@web-client-ssr-server/app.controller'
import { AssetMiddleware } from '@web-client-ssr-server/asset.middleware'

@Module({
    imports: [ConfigModule],
    controllers: [AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AssetMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}