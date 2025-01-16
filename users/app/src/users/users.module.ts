import { Module } from '@nestjs/common'
import { UsersServise } from './users.service'
import { UsersController } from './users.controller'
import { UsersRepository } from './repository/users.respository'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
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
        uri: configService.get<string>('USERS_RABBITMQ_URL'),
        connectionInitOptions: { wait: true },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersServise, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
