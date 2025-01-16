import { Injectable, Logger } from '@nestjs/common'
import { UsersRepository } from './repository/users.respository'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class UsersServise {
  private readonly logger = new Logger(UsersServise.name)
  constructor(
    private readonly repository: UsersRepository,
    private readonly rabbit: AmqpConnection,
  ) {}

  public async get(filter: UserFilter) {
    const user = await this.repository.filter(filter)
    return this.convertUser(user)
  }

  public async getMany(filter: UserFilterMany, sort: Pagination) {
    const users = await this.repository.filterMany(filter, sort)
    const count = await this.repository.count(filter)
    return { data: users, count }
  }

  public async create(payload: UserCreate) {
    const _id = await this.repository.create(payload)
    const user = await this.get({ id: _id.toString() })
    this.notificate('User created')
    return this.convertUser(user)
  }

  public async update(user: User, payload: UserUpdate) {
    return await this.repository.update(user['_id'], payload)
  }

  public async delete(id: string) {
    this.notificate('User deleted')
    return this.repository.delete(id)
  }

  private notificate(message: string) {
    try {
      this.rabbit.publish('USERS_SERVICE', 'users-create', message)
    } catch (e) {
      this.logger.warn(`Cannot notify => ${e}`)
    }
  }

  private convertUser(payload: User) {
    delete payload?.['_id']
    return payload
  }
}
