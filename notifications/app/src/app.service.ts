import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  @RabbitSubscribe({
    exchange: 'USERS_SERVICE',
    routingKey: 'users-create',
    queue: 'users_queue',
  })
  async handleUsersActions(payload: any) {
    const data = JSON.stringify(payload, null, 2)
    this.logger.debug(data)
  }
}
