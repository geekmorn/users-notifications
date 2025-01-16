import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('USERS_MONGO_HOST')
        const port = configService.get('USERS_MONGO_PORT')
        const user = configService.get('USERS_MONGO_USER')
        const password = configService.get('USERS_MONGO_PASS')
        const uri = `mongodb://${user}:${password}@${host}:${port}`
        return { uri }
      },
    }),
  ],
})
export class MongooseProvider {}
