import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseProvider } from './mongoose.provider'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../../.env', isGlobal: true }),
    MongooseProvider,
    UsersModule,
  ],
})
export class AppModule {}
