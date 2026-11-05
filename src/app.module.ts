import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@server/modules/config/config.module'
import { AppController } from './app.controller'
import { HealthController } from './health.controller'
import { AssetMiddleware } from './asset.middleware'

@Module({
    imports: [ConfigModule],
    controllers: [HealthController, AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AssetMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
