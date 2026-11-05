import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@server/modules/config/config.module'
import { AppController } from './app.controller'
import { AssetMiddleware } from './asset.middleware'

@Module({
    imports: [ConfigModule],
    controllers: [AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AssetMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}