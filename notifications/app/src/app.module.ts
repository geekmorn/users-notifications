import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'USERS_SERVICE',
          },
        ],
        queues: [
          {
            name: 'users_queue',
            exchange: 'USERS_SERVICE',
            routingKey: 'users-create',
          },
        ],
        uri: configService.get<string>('NOTIFICATIONS_RABBITMQ_URL'),
        connectionInitOptions: { wait: true },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
