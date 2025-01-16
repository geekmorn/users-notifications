import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Collection, Connection, Types } from 'mongoose'

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name)
  private readonly collectionName = 'users_db'
  private readonly collection: Collection<User>
  private readonly paginationLimit = 100

  constructor(@InjectConnection() connection: Connection) {
    this.collection = connection.collection(this.collectionName)
  }

  public async filter(filter: UserFilter): Promise<User | null> {
    try {
      if (filter.id) {
        filter['_id'] = new Types.ObjectId(filter.id)
        delete filter.id
      }
      return this.collection.findOne(filter)
    } catch (e) {
      const dataDebug = JSON.stringify(filter, null, 2)
      this.logger.error(`${this.filter.name} => ${e?.['message']}\n${dataDebug}`)
      return null
    }
  }

  public async filterMany(filter: UserFilterMany, sort?: Pagination): Promise<User[]> {
    try {
      const skip = Number(sort.offset ?? 0)
      const limit = Number(sort.limit ?? this.paginationLimit)
      return this.collection.find(filter).skip(skip).limit(limit).toArray()
    } catch (e) {
      const dataDebug = JSON.stringify(filter, null, 2)
      this.logger.error(`${this.filter.name} => ${e?.['message']}\n${dataDebug}`)
      return []
    }
  }

  public async count(filter: UserFilterMany): Promise<number> {
    try {
      return this.collection.countDocuments(filter)
    } catch (e) {
      const dataDebug = JSON.stringify(filter, null, 2)
      this.logger.error(`${this.count.name} => ${e?.['message']}\n${dataDebug}`)
    }
  }

  public async create(payload: UserCreate): Promise<Types.ObjectId | null> {
    try {
      payload['createdAt'] = new Date().toISOString()
      const data = await this.collection.insertOne(payload)
      return data.insertedId
    } catch (e) {
      const dataDebug = JSON.stringify(payload, null, 2)
      this.logger.error(`${this.create.name} => ${e?.['message']}\n${dataDebug}`)
      return null
    }
  }

  public async update(id: string, payload: UserUpdate): Promise<boolean> {
    try {
      await this.collection.updateOne({ id }, { $set: payload })
      return true
    } catch (e) {
      const dataDebug = JSON.stringify(payload, null, 2)
      this.logger.error(`${this.create.name} => ${e?.['message']}\n${dataDebug}`)
      return false
    }
  }

  public async delete(id: string) {
    try {
      const _id = new Types.ObjectId(id)
      await this.collection.deleteOne({ _id })
      return true
    } catch (e) {
      this.logger.error(`${this.create.name} => ${e?.['message']}`)
      return false
    }
  }
}
